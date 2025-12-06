import { FEATURES } from '@/utils/data'
import React from 'react'

const Features = () => {
  return (
    <div id='features' className='relative py-24 lg:py-32 border-b border-[#e8e0d5] bg-[#faf7f3] overflow-hidden'>

      <div className="absolute inset-0 bg-linear-to-r from-teal-50/50 via-transparent to-cyan-50/50"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-teal-100 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-teal-900">
              Features
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-light">
            EveryThing You need to
            <span className="block mt-2 bg-linear-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Create Your Ebook
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Our platform is packed with powerful features to help you write, design,and publish your ebook effortlessly
          </p>
        </div>
        <div className="grid grid-cols-1 mdLgrid-cols2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className='group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-teal-200 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/50 hover:translate-y-1'
              >
                <div className="absolute inset-0 bg-linear-to-r from-teal-50/0 to-cyan-50/0 group-hover:from-teal-50/50 group-hover:to-cyan-50/50 rounded-2xl transition-all duration-300"></div>
                <div className="relative space-y-4">
                  <div className={`w-14 h-14 bg-linear-to-br ${feature.gradient} flex items-center justify-center shadow-lg shadow-${feature.gradient}/20 group-hover:scale-110 transition-transform duration-300 rounded-xl`}>
                    <Icon className='w-7 h-7 text-white' />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>

                </div>
                <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-teal-600 text-sm font-medium inline-flex items-center">
                    Learn More
                    <svg
                      className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform'
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap='round'
                        strokeLineJoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">Ready to get started</p>
          <a 
          href='/signup' 
          className='inline-flex items-center space-x-2 bg-linear-to-r from-teal-400 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-teal-500/50 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-200'>
            <span>Start Creating today</span>
            <svg
              className='w-5 h-5'
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap='round'
                strokeLineJoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-SH6"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Features