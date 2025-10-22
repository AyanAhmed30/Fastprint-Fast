'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const GuideTemplateRedirect = ({
  text = "Download Templates",
  width = "500px",
  height = "44px",
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/resources/guide-templates');
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={handleClick}
        className="flex justify-center items-center px-[24px] py-[12px] text-white text-[16px] font-medium rounded-full"
        style={{
          background: 'linear-gradient(29.94deg, #016AB3 -87.29%, #0096CD 29.75%, #00AEDC 104.58%)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          width,
          height,
        }}
      >
        {text}
      </button>
    </div>
  );
};

export default GuideTemplateRedirect;
