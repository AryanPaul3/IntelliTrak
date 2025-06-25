function Input({icon:Icon , ...props}) {
  return (
    <div className='relative mb-6'>
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <Icon className='size-5 text-teal-400' />
        </div>
        <input
            {...props}
            className='w-full pl-10 pr-3 py-2 bg-gray-700/50 rounded-lg border border-zinc-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 text-zinc-100 placeholder-zinc-400 transition duration-200'
        />
    </div>
  )
}

export default Input
