import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

function CollapsibleFilter({ title, options }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-300 rounded-2xl mb-3 bg-white">
      {/* 필터 제목 부분 */}
      <button
        onClick={toggleFilter}
        className="w-full flex justify-between items-center p-3 font-semibold text-left"
      >
        <span>{title}</span>
        {/* 눌렀을 때 아이콘 회전 */}
        <FaChevronDown
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* isOpen 조건부 렌더링 */}
      {isOpen && (
        <div className="border-t p-2 bg-white rounded-b-2xl">
          <ul>
            {options && options.length > 0 ? (
              options.map((option, index) => {
                const displayText = typeof option === 'string' ? option : option.label;
                const value = typeof option === 'string' ? option : option.value;
                
                return (
                  <li
                    key={value || index}
                    className="p-2 rounded-md cursor-pointer flex items-center space-x-2"
                  >
                    <button className="w-4 h-4 border border-gray-400 rounded-sm bg-white"></button>
                    <span>{displayText}</span>
                  </li>
                );
              })
            ) : (
              <li className="p-2 text-gray-500">옵션이 없습니다</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CollapsibleFilter;