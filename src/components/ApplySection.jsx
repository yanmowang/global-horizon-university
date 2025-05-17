import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from './shared/Button';

const ApplySection = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="overflow-hidden rounded-lg bg-[#003087] shadow-xl lg:grid lg:grid-cols-2 lg:gap-4"
          style={{ background: 'linear-gradient(135deg, #002266 0%, #003087 100%)' }}
        >
          <div className="px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block text-white font-bold drop-shadow-md">申请我们的课程</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-white drop-shadow">
                立即提交您的申请，我们的招生顾问将与您联系，指导您完成申请流程，并回答您的任何问题。
              </p>
              <Button
                variant="secondary"
                size="lg"
                to="/contact"
                className="mt-8 bg-white text-[#003087] hover:bg-gray-100 font-bold"
              >
                联系招生顾问
              </Button>
            </div>
          </div>
          <div className="aspect-w-5 aspect-h-3 -mt-6 md:aspect-w-2 md:aspect-h-1">
            <img
              className="translate-x-6 translate-y-6 transform rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
              src="/images/general/students-applying.jpg"
              alt="申请课程"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplySection;
