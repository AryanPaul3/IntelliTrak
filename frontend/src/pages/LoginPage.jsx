import { useState } from 'react'
import { Link } from 'react-router'
import Input from '../components/Input'
import { motion } from 'framer-motion'
import { Mail, Lock , Loader } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router'
import GoogleSignInButton from '../components/GoogleSignInButton';


function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { login, isLoading, error } = useAuthStore()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await login(email, password)
            navigate('/')
        } catch (err) {
            console.error("Login error:", err);
        }
    }
  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-md w-full bg-zinc-800/70 border border-zinc-700 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >
        <div className='p-8'>
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text'>
                Welcome Back
            </h2>

            <form onSubmit={handleLogin}>
                <Input
                    icon={Mail}
                    type='email'
                    placeholder='Email Address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    icon={Lock}
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className='flex items-center mb-6'>
                    <Link to='/forgot-password' className='text-sm text-teal-400 hover:underline'>
                        Forgot password?
                    </Link>
                </div>
                {error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition duration-200 disabled:opacity-70'
                    type='submit'
                    disabled={isLoading}
                >
                    {isLoading ? <Loader className='w-6 h-6 animate-spin  mx-auto' /> : "Login"}
                </motion.button>
            </form>

            <div className='my-4 flex items-center'>
                <div className='flex-grow border-t border-zinc-600'></div>
                <span className='flex-shrink mx-4 text-zinc-400 text-sm'>OR</span>
                <div className='flex-grow border-t border-zinc-600'></div>
            </div>
            <GoogleSignInButton />
        </div>
        <div className='px-8 py-4 bg-zinc-900 flex justify-center'>
            <p className='text-sm text-zinc-400'>
                Don't have an account?{" "}
                <Link to='/signup' className='text-teal-400 hover:underline'>
                    Sign up
                </Link>
            </p>
        </div>
    </motion.div>
  )
}

export default LoginPage
