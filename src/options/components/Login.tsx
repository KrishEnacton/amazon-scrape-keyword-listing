export const Login = () => {
  return (
    <div className="w-2/6 h-screen   my-16 items-center justify-center gap-x-12 mx-auto">
      <div className="flex flex-col rounded-md m-6">
        <div className="mt-3 text-center sm:mt-5 ">Amazon ASIN</div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
