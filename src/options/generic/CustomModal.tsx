import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const CustomModal: React.FC<{
  modal_title: string
  modal_description?: string
  isOpen: boolean
  loading?: boolean
  id?: string
  closeModal: () => void
  confirm: (e: any) => void
}> = ({ isOpen, modal_title, loading, modal_description, closeModal, confirm, id }) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" id={id} onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-custom-bg p-6 text-left align-middle shadow-xl transition-all bg-white text-black">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-custom_black">
                    {modal_title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-base_text">{modal_description}</p>
                  </div>

                  <div className="mt-4 gap-x-4 justify-end flex">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-secondary_button px-4 py-2 text-sm text-secondary_text font-bold bg-green-400 text-whitefocus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={confirm}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary_button text-primary_text bg-red-400 px-4 py-2 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      No
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default CustomModal
