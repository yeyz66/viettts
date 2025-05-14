'use client';

import { Popover, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';

interface ConfirmPopoverProps {
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'red' | 'blue' | 'green';
  placement?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

export default function ConfirmPopover({
  onConfirm,
  title,
  description,
  confirmText = '',
  cancelText = '',
  confirmColor = 'red',
  placement = 'top',
  children
}: ConfirmPopoverProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // 根据确认按钮颜色设置样式
  const getConfirmButtonClass = () => {
    const baseClasses = 'inline-flex justify-center px-3 py-1.5 text-sm font-medium text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
    
    switch (confirmColor) {
      case 'red':
        return `${baseClasses} bg-red-600 hover:bg-red-700 focus-visible:ring-red-500`;
      case 'blue':
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500`;
      case 'green':
        return `${baseClasses} bg-green-600 hover:bg-green-700 focus-visible:ring-green-500`;
      default:
        return `${baseClasses} bg-red-600 hover:bg-red-700 focus-visible:ring-red-500`;
    }
  };

  // 根据放置位置设置面板样式
  const getPanelPositionClass = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full mb-2';
      case 'right':
        return 'left-full ml-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      default:
        return 'top-full mt-2';
    }
  };

  return (
    <Popover className="relative inline-block">
      {({ close }) => (
        <>
          <Popover.Button ref={buttonRef} className="focus:outline-none">
            {children}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel 
              className={`absolute z-50 w-56 ${getPanelPositionClass()} sm:px-0 transform -translate-x-1/2 left-1/2 sm:left-auto sm:transform-none`}
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                    {title}
                  </div>
                  {description && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {description}
                      </p>
                    </div>
                  )}
                  <div className="mt-2 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={() => close()}
                    >
                      {cancelText}
                    </button>
                    <button
                      type="button"
                      className={getConfirmButtonClass()}
                      onClick={() => {
                        onConfirm();
                        close();
                      }}
                    >
                      {confirmText}
                    </button>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
} 