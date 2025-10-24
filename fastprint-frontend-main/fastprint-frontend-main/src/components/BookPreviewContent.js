"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/context/authContext";
import axios from "axios";
import { BASE_URL } from "@/services/baseUrl";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = `${BASE_URL}`;

const NavBar = ({ navigate }) => (
  <div
    className="w-full h-auto min-h-[51px] flex items-center justify-center gap-2 sm:gap-4 md:gap-8 px-2 sm:px-4 py-2"
    style={{
      background:
        "linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)",
    }}
  >
    <span
      className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold cursor-pointer pb-1 px-2 py-1 border-b-2 sm:border-b-4 border-transparent hover:border-yellow-400 transition-all text-center whitespace-nowrap"
      onClick={() => navigate("/start-project")}
    >
      Start Project
    </span>
    <span
      className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold cursor-pointer pb-1 px-2 py-1 border-b-2 sm:border-b-4 border-transparent hover:border-yellow-400 transition-all text-center whitespace-nowrap"
      onClick={() => navigate("/design-project")}
    >
      Designs
    </span>
    <span
      className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold cursor-pointer pb-1 px-2 py-1 border-b-2 sm:border-b-4 border-transparent hover:border-yellow-400 transition-all text-center whitespace-nowrap"
      onClick={() => navigate("/book-preview")}
    >
      Book Preview
    </span>
  </div>
);

let pdfjsLib = null;

const loadPdfLib = async () => {
  if (typeof window === "undefined") return null;
  if (pdfjsLib) return pdfjsLib;

  try {
    const lib = await import("pdfjs-dist");
    lib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
    pdfjsLib = lib;
    return lib;
  } catch (err) {
    console.error("Failed to load PDF.js:", err);
    throw new Error("PDF processor failed to initialize.");
  }
};

const BookPreviewContent = () => {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditPreview = searchParams.get("edit") === "true";

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [renderedPages, setRenderedPages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);

  const bookRef = useRef();

  // detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (numPages > 0) {
      if (isMobile) {
        setCurrentPage(1);
      } else {
        setCurrentPage([1, numPages > 1 ? 2 : null]);
      }
    }
  }, [numPages, isMobile]);

  // ✅ Read PDF file from window object instead of localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && window.tempBookFileForSubmission) {
      setPdfFile(window.tempBookFileForSubmission);
    } else {
      alert("No PDF file found for preview. Please upload a file first.");
      router.push("/design-project");
    }
  }, [router]);

  useEffect(() => {
    if (!pdfFile) return;

    const loadAndRenderPdf = async () => {
      try {
        const pdfjs = await loadPdfLib();
        if (!pdfjs) throw new Error("PDF.js library not loaded.");

        // Read the File object directly using FileReader
        const fileReader = new FileReader();
        fileReader.onload = async function () {
          try {
            const typedarray = new Uint8Array(this.result);
            const loadingTask = pdfjs.getDocument({ data: typedarray });
            const pdfDoc = await loadingTask.promise;
            setPdfDocument(pdfDoc);
            setNumPages(pdfDoc.numPages);

            const allPages = [];
            for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
              const page = await pdfDoc.getPage(pageNum);
              const scale = 1.5;
              const viewport = page.getViewport({ scale });

              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              await page.render({ canvasContext: context, viewport }).promise;
              allPages.push(canvas.toDataURL("image/png"));
            }

            if (!isMobile && pdfDoc.numPages % 2 !== 0) {
              allPages.push("cover");
            }

            setRenderedPages(allPages);
          } catch (err) {
            console.error("PDF rendering error:", err);
            alert("Failed to render the PDF preview. Please try again.");
          }
        };
        fileReader.onerror = function () {
          alert("Failed to read PDF file.");
        };
        fileReader.readAsArrayBuffer(pdfFile);
      } catch (error) {
        console.error("Error loading PDF:", error);
        alert("Failed to load the PDF preview. Please try again.");
      }
    };

    loadAndRenderPdf();
  }, [pdfFile, isMobile]);

  const handleFlip = (e) => {
    const pageIndex = e.data;
    if (isMobile) {
      setCurrentPage(pageIndex + 1);
    } else {
      const leftPage = pageIndex + 1;
      const rightPage = pageIndex + 2 <= numPages ? pageIndex + 2 : null;
      setCurrentPage([leftPage, rightPage]);
    }
  };

  const handleSubmit = async () => {
    const formDataString = localStorage.getItem("previewFormData");
    const projectDataString = localStorage.getItem("previewProjectData");
    const bookFile = window.tempBookFileForSubmission;
    const coverFile = window.tempCoverFileForSubmission;

    if (!formDataString || !projectDataString || !bookFile || !token) {
      alert("Missing required data. Please go back and complete all steps.");
      return;
    }

    let formDataObj;
    let projectData;
    try {
      formDataObj = JSON.parse(formDataString);
      projectData = JSON.parse(projectDataString);
    } catch (e) {
      alert("Invalid project data. Please restart the process.");
      return;
    }

    const isCalendar = projectData.category === "Calender" || projectData.category === "Calendar";

    const getOptionName = (optionsStr, id) => {
      if (!optionsStr) return "";
      try {
        const options = JSON.parse(optionsStr);
        return options.find((opt) => opt.id === Number(id))?.name || "";
      } catch {
        return "";
      }
    };

    const bindingsStr = localStorage.getItem("previewDropdowns");
    let bindings = [], interior_colors = [], paper_types = [], cover_finishes = [], trim_sizes = [];
    if (bindingsStr) {
      const dropdowns = JSON.parse(bindingsStr);
      bindings = dropdowns.bindings || [];
      interior_colors = dropdowns.interior_colors || [];
      paper_types = dropdowns.paper_types || [];
      cover_finishes = dropdowns.cover_finishes || [];
      trim_sizes = dropdowns.trim_sizes || [];
    }

    const formData = new FormData();
    formData.append("title", projectData.projectTitle || "");
    formData.append("category", projectData.category);
    formData.append("language", projectData.language);
    formData.append("pdf_file", bookFile);
    if (coverFile) formData.append("cover_file", coverFile);

    formData.append("binding_type", getOptionName(JSON.stringify(bindings), formDataObj.binding_id));
    formData.append("cover_finish", getOptionName(JSON.stringify(cover_finishes), formDataObj.cover_finish_id));
    formData.append("interior_color", getOptionName(JSON.stringify(interior_colors), formDataObj.interior_color_id));
    formData.append("paper_type", getOptionName(JSON.stringify(paper_types), formDataObj.paper_type_id));
    if (!isCalendar) {
      formData.append("trim_size", getOptionName(JSON.stringify(trim_sizes), formDataObj.trim_size_id));
    }
    formData.append("page_count", formDataObj.page_count || (isCalendar ? 1 : ""));

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      },
    };

    try {
      let response;
      if (isEditPreview && projectData.projectId) {
        response = await axios.put(
          `${API_BASE}api/book/books/${projectData.projectId}/update/`,
          formData,
          config
        );
      } else {
        response = await axios.post(
          `${API_BASE}api/book/upload-book/`,
          formData,
          config
        );
      }

      // NEW: Ensure price/qty are pushed to "shopData" before redirect
      try {
        // Get pricing/qty from previous calculation step
        const shopDataRaw = localStorage.getItem("shopData");
        let shopData = (shopDataRaw && JSON.parse(shopDataRaw)) || {};
        // Fallback: also try to derive from previewFormData if available
        const formDataObj = JSON.parse(formDataString || '{}');
        if (!shopData.productQuantity && formDataObj.quantity) {
          shopData.productQuantity = formDataObj.quantity;
        }
        // Defensive: set to zero if missing
        shopData.originalTotalCost = shopData.originalTotalCost || 0;
        shopData.finalTotalCost = shopData.finalTotalCost || 0;
        shopData.totalCost = shopData.totalCost || 0;
        shopData.productQuantity = shopData.productQuantity || 1;
        shopData.costPerBook = shopData.costPerBook || 0;
        localStorage.setItem("shopData", JSON.stringify(shopData));
      } catch (err) {
        // Safe to ignore: don't block printing
      }

      if (response.data?.status === "success") {
        alert(isEditPreview ? "Project updated successfully!" : "Project submitted successfully!");
        router.push("/shop");
      } else {
        alert("Submission failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        error.response?.data?.message ||
        error.message ||
        "An error occurred while submitting your project."
      );
    }
  };

  if (!pdfFile || !renderedPages[0]) {
    return (
      <>
        <NavBar navigate={router.push} />
        <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#016AB3]/20 border-t-[#016AB3]" />
            </div>
            <p className="text-xl font-semibold text-[#016AB3] mt-6">Loading Book...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar navigate={router.push} />
      <div className="w-full min-h-screen px-4 md:px-6 py-6 md:py-10 bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] font-sans">
        <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12 rounded-xl md:rounded-2xl shadow-xl bg-gradient-to-r from-[#ffe4ec] via-[#fdfdfd] to-[#e0f3ff] flex flex-col gap-6 md:gap-8 lg:gap-10">
          <div className="relative flex justify-center items-center px-2">
            <div
              className="absolute left-0 right-0 h-[2px] sm:h-[3px] lg:h-[4px]"
              style={{
                background:
                  "linear-gradient(90deg, #D15D9E 38.04%, #5D4495 121.51%)",
              }}
            />
            <div
              className="h-[35px] sm:h-[42px] lg:h-[47px] w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[440px] mx-2 sm:mx-4 flex items-center justify-center text-white font-medium text-xs sm:text-sm lg:text-base z-10 px-2 sm:px-4"
              style={{
                background:
                  "linear-gradient(90deg, #D15D9E 38.04%, #5D4495 121.51%)",
                borderRadius: "120px",
              }}
            >
              Preview Book
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-[#2A428C]">
              Review Your Book
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Use this preview to see how your book will look. Carefully review
              margins, layout, and content before continuing. Your book will
              print exactly as shown.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <div className="flex justify-center items-center mb-8">
              <HTMLFlipBook
                onFlip={handleFlip}
                width={isMobile ? 320 : 500}
                height={isMobile ? 450 : 750}
                size="stretch"
                minWidth={250}
                maxWidth={1000}
                minHeight={300}
                maxHeight={1000}
                maxShadowOpacity={0.5}
                showCover={false}
                mobileScrollSupport={true}
                className="shadow-2xl rounded-none"
                ref={(book) => (bookRef.current = book)}
                flippingTime={600}
                useMouseEvents={true}
                startZIndex={5}
                autoSize={true}
              >
                {renderedPages.map((page, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-center border ${
                      page === "cover" ? "bg-black" : "bg-white p-2"
                    }`}
                  >
                    {page === "cover" ? (
                      <div className="flex justify-center items-center w-full h-full">
                        <span className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                          The End
                        </span>
                      </div>
                    ) : (
                      <img
                        src={page}
                        alt={`Page ${i + 1}`}
                        className="w-full h-auto object-contain"
                      />
                    )}
                  </div>
                ))}
              </HTMLFlipBook>
            </div>

            <div className="flex justify-center items-center gap-6 mb-8">
              <button
                className="p-3 bg-[#2A428C] text-white rounded-full hover:bg-[#1d326c] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => bookRef.current.pageFlip().flipPrev()}
                disabled={isMobile ? currentPage === 1 : currentPage[0] === 1}
              >
                <ChevronLeft size={20} />
              </button>

              <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">
                {isMobile ? (
                  <>
                    Page {currentPage} of {numPages}
                  </>
                ) : (
                  <>
                    Pages {currentPage[0]}
                    {currentPage[1] && currentPage[1] <= numPages
                      ? `-${currentPage[1]}`
                      : ""}{" "}
                    of {numPages}
                  </>
                )}
              </span>

              <button
                className="p-3 bg-[#2A428C] text-white rounded-full hover:bg-[#1d326c] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => bookRef.current.pageFlip().flipNext()}
                disabled={
                  isMobile
                    ? currentPage === numPages
                    : !currentPage[1] || currentPage[1] >= numPages
                }
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold text-[#2A428C] mb-4">
                Important Information Note
              </h2>
              <p>Please carefully review your files before uploading to ensure your book is print-ready.
By proceeding, you acknowledge and accept the following responsibilities:
</p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>	All text, images, and design elements are correctly placed and fully visible within the print margins.</li>
                <li>All images are high-resolution, clear, and properly aligned.</li>
                <li>Page numbers are accurate, sequential, and consistently formatted.</li>
                <li>
                  All chapters, sections, and pages are in the correct order
                </li>
                <li>The table of contents, if included, accurately reflects the final page layout.</li>
              </ol>
              <p className="text-red-600 text-sm font-semibold mt-4">
                Disclaimer:: Fast Print Guys prints files exactly as provided. We do not review or proofread content prior to printing. By submitting your files, you confirm that they are final and approved for production. Fast Print Guys is not responsible for any errors, omissions, or layout issues that appear in the printed product.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 md:gap-6 mt-6 md:mt-10">
              <button
                onClick={handleSubmit}
                disabled={uploadProgress > 0 && uploadProgress < 100}
                className="w-full max-w-md md:max-w-lg lg:max-w-xl px-6 md:px-10 py-2 md:py-3 bg-gradient-to-r from-[#F8C20A] to-[#EE831E] text-white font-medium text-sm md:text-base rounded-full shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {uploadProgress > 0 && uploadProgress < 100
                  ? `Uploading... ${uploadProgress}%`
                  : "Print Your Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookPreviewContent;