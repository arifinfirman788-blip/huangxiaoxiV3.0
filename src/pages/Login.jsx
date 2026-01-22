import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Smartphone, Lock, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { getPlaceholder } from '../utils/imageUtils';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState('landing'); // landing, login, forgot
  const [loginMethod, setLoginMethod] = useState('code'); // code, password
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form States
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  
  const from = location.state?.from?.pathname || '/';

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
      navigate(from, { replace: true });
    }, 1500);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('密码重置成功，请重新登录');
      setStep('login');
    }, 1500);
  };

  // Background Video
  // const bgVideo = "/video/background.mp4"; // Local video file
  const bgVideo = "/video/guizhou_seasons.mp4"; // Local video file

  return (
    <div className="h-full w-full relative bg-slate-900 overflow-hidden font-sans text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-80"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 h-full flex flex-col justify-end p-8 pb-16"
          >
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                    <span className="font-bold text-white">黄</span>
                 </div>
                 <span className="text-xl font-bold tracking-wide">多彩黄小西</span>
              </div>
              <h1 className="text-4xl font-light leading-tight mb-4">
                游贵州，找小西 <br/>
                <span className="text-cyan-400 font-bold">全程贴心陪伴 <br/> 你的全域向导</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed max-w-[80%]">
                不管去哪儿，不管玩啥，有事儿您说话，黄小西一直都在。
              </p>
            </div>

            <button 
              onClick={() => setStep('login')}
              className="group relative h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full overflow-hidden flex items-center pr-2 pl-6"
            >
              <span className="flex-1 text-left font-bold text-sm tracking-wide">立即开启</span>
              <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center group-active:scale-95 transition-transform">
                <ChevronRight size={20} className="text-white" />
              </div>
            </button>
          </motion.div>
        )}

        {step === 'login' && (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="relative z-10 h-full flex flex-col"
          >
            <div className="p-4 pt-12">
              <button 
                onClick={() => setStep('landing')}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-end p-8 pb-10">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center">欢迎回来</h2>
                
                {/* Tabs */}
                <div className="flex p-1 bg-black/20 rounded-xl mb-6">
                  <button 
                    onClick={() => setLoginMethod('code')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${loginMethod === 'code' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/60'}`}
                  >
                    验证码登录
                  </button>
                  <button 
                    onClick={() => setLoginMethod('password')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${loginMethod === 'password' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/60'}`}
                  >
                    密码登录
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60 pl-3">手机号</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                        <Smartphone size={18} />
                      </div>
                      <input 
                        type="tel" 
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="请输入手机号"
                        className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  {loginMethod === 'code' ? (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/60 pl-3">验证码</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                          <ShieldCheck size={18} />
                        </div>
                        <input 
                          type="text" 
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="请输入验证码"
                          className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-white/10 px-2 py-1 rounded-md text-cyan-400 hover:bg-white/20 transition-colors">
                          获取验证码
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/60 pl-3">密码</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                          <Lock size={18} />
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="请输入密码"
                          className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button 
                          type="button"
                          onClick={() => setStep('forgot')}
                          className="text-[10px] text-white/50 hover:text-white transition-colors"
                        >
                          忘记密码?
                        </button>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 active:scale-95 rounded-xl text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center mt-4"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : '登 录'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'forgot' && (
          <motion.div 
            key="forgot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative z-10 h-full flex flex-col"
          >
            <div className="p-4 pt-12">
              <button 
                onClick={() => setStep('login')}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-end p-8 pb-10">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl">
                <h2 className="text-2xl font-bold mb-2 text-center">重置密码</h2>
                <p className="text-xs text-center text-white/50 mb-6">请输入手机号和验证码以重置您的密码</p>
                
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60 pl-3">手机号</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                        <Smartphone size={18} />
                      </div>
                      <input 
                        type="tel" 
                        placeholder="请输入手机号"
                        className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60 pl-3">验证码</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                        <ShieldCheck size={18} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="请输入验证码"
                        className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-white/10 px-2 py-1 rounded-md text-cyan-400 hover:bg-white/20 transition-colors">
                        获取验证码
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60 pl-3">新密码</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                        <Lock size={18} />
                      </div>
                      <input 
                        type="password" 
                        placeholder="请输入新密码"
                        className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 active:scale-95 rounded-xl text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center mt-4"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : '重 置'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
