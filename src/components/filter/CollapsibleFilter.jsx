import React, { useState } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

function CollapsibleFilter({ 
  title, 
  options, 
  roundedClass = "rounded-2xl", 
  titleClass = "font-semibold", 
  showSelected = false,
  selectedOptions = [],
  onSelectionChange,
  singleSelect = false
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  // 옵션 선택/해제
  const toggleOption = (value) => {
    let newSelection;
    if (singleSelect) {
      // 단일 선택 모드
      newSelection = selectedOptions.includes(value) ? [] : [value];
    } else {
      // 다중 선택 모드
      newSelection = selectedOptions.includes(value) 
        ? selectedOptions.filter(item => item !== value)
        : [...selectedOptions, value];
    }
    
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    }
  };

  return (
    <div className={`border border-gray-300 ${roundedClass} mb-3 bg-white`}>
      {/* 필터 제목 부분 */}
      <button
        onClick={toggleFilter}
        className={`w-full flex justify-between items-center p-3 px-7 ${titleClass} text-left`}
      >
         <span>
           {showSelected && selectedOptions.length > 0 
             ? selectedOptions.join(', ') 
             : title
           }
         </span>
        {/* 눌렀을 때 아이콘 회전 */}
        <FaChevronDown
          className={`transform transition-transform duration-400 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* isOpen 조건부 렌더링 */}
      {isOpen && (
        <div className={`border-t p-2 pb-2 bg-white ${roundedClass.replace('rounded-2xl', 'rounded-b-2xl').replace('rounded-lg', 'rounded-b-lg')}`}>
          <ul>
            {options && options.length > 0 ? (
              options.map((option, index) => {
                const displayText = typeof option === 'string' ? option : option.label;
                const value = typeof option === 'string' ? option : option.value;
                const isSelected = selectedOptions.includes(value);
                
                return (
                  <li
                    key={value || index}
                    className="p-2 px-5 rounded-md cursor-pointer flex items-center space-x-2"
                    onClick={() => toggleOption(value)}
                  >
                    <button 
                      className={`w-4 h-4 border border-gray-400 rounded-sm transition-colors flex items-center justify-center ${
                        isSelected ? 'bg-green-500 border-green-500' : 'bg-white'
                      }`}
                    >
                      {isSelected && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </button>
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