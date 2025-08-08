// src/pages/Login.jsx
export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="mb-2 text-3xl font-bold text-center text-gray-800">Welcome Back</h1>
        <p className="mb-8 text-center text-gray-600">Sign in to your account</p>
        
        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}