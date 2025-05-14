'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'red' | 'blue' | 'green';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  confirmColor = 'red'
}: ConfirmDialogProps) {
  // 根据确认按钮颜色设置样式
  const getConfirmButtonClass = () => {
    const baseClasses = 'inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
    
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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={onClose}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    className={getConfirmButtonClass()}
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 