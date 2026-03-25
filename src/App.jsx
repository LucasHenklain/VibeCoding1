import { useEffect, useRef, useState } from 'react';
import { Activity, Cpu, Database, Network, Send, Terminal, Wind, Zap } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('IDLE');
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({ load: 5, temp: 22, power: 1.2 });
  const [activeBlades, setActiveBlades] = useState([]);
  const canvasRef = useRef(null);

  const addLog = (msg, type) => {
    setLogs((prev) => [...prev, { id: Date.now(), msg, type }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || status !== 'IDLE') return;

    setLogs([]);
    setStatus('TRANSMITTING');
    setMetrics({ load: 15, temp: 24, power: 2.5 });

    setTimeout(() => {
      setStatus('PROCESSING');
      setMetrics({ load: 98, temp: 78, power: 14.5 });
      addLog('Chegada no Data Center Scala', 'network');
      addLog('Alocando cluster de GPUs H100', 'system');

      setTimeout(() => addLog('Agente inicializado. Contexto carregado.', 'ai'), 800);
      setTimeout(() => addLog('MCP: Consultando banco de dados corporativo...', 'mcp'), 1800);
      setTimeout(() => addLog('Gerando inferencia de modelo longo...', 'gpu'), 3000);
      setTimeout(() => addLog('Resposta sintetizada.', 'ai'), 4500);

      setTimeout(() => {
        setActiveBlades([]);
        setStatus('RETURNING');
        setMetrics({ load: 20, temp: 55, power: 4.0 });

        setTimeout(() => {
          setStatus('IDLE');
          setMetrics({ load: 5, temp: 25, power: 1.2 });
          setPrompt('');
          addLog('Resposta entregue com sucesso.', 'success');
        }, 1500);
      }, 5000);
    }, 1500);
  };

  useEffect(() => {
    let interval;
    if (status === 'PROCESSING') {
      interval = setInterval(() => {
        const numBlades = Math.floor(Math.random() * 10) + 5;
        const newBlades = Array.from({ length: numBlades }, () => Math.floor(Math.random() * 24));
        setActiveBlades(newBlades);

        setMetrics((m) => ({
          load: Math.min(100, Math.max(85, m.load + (Math.random() * 10 - 5))),
          temp: Math.min(90, Math.max(70, m.temp + (Math.random() * 4 - 2))),
          power: Math.min(16, Math.max(12, m.power + (Math.random() * 2 - 1))),
        }));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const createParticle = () => {
      const isTransmitting = status === 'TRANSMITTING';
      const isReturning = status === 'RETURNING';
      if (!isTransmitting && !isReturning) return;

      particles.push({
        x: isTransmitting ? 0 : canvas.width,
        y: canvas.height / 2 + (Math.random() * 20 - 10),
        speed: (isTransmitting ? 1 : -1) * (Math.random() * 5 + 10),
        size: Math.random() * 3 + 1,
        color: isReturning ? '#10b981' : '#0ea5e9',
      });
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.strokeStyle = status === 'IDLE' ? '#1e293b' : status === 'RETURNING' ? '#047857' : '#0369a1';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (Math.random() < 0.4) createParticle();

      particles.forEach((p, index) => {
        p.x += p.speed;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();

        if (p.x > canvas.width + 50 || p.x < -50) {
          particles.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [status]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-4 md:p-8 selection:bg-cyan-900 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600 rounded-full mix-blend-screen filter blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">O Caminho do Prompt</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A IA nao roda "na nuvem". Ela roda aqui. Digite um comando e assista a ativacao da infraestrutura fisica e logica em tempo real.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col h-[450px]">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
              <Terminal className="text-cyan-400 w-5 h-5" />
              <h2 className="text-white font-semibold tracking-wide">Interface do Usuario</h2>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 font-mono text-xs md:text-sm scrollbar-thin scrollbar-thumb-slate-700 pr-2">
              <div className="text-slate-500">Sistema pronto. Aguardando input...</div>
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2 animate-fade-in-up">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                  <span
                    className={`${log.type === 'network' ? 'text-cyan-400' : ''} ${log.type === 'system' ? 'text-purple-400' : ''} ${log.type === 'ai' ? 'text-white' : ''} ${log.type === 'mcp' ? 'text-orange-400' : ''} ${log.type === 'gpu' ? 'text-pink-400' : ''} ${log.type === 'success' ? 'text-emerald-400 font-bold' : ''}`}
                  >
                    {log.msg}
                  </span>
                </div>
              ))}
              {status === 'PROCESSING' && (
                <div className="flex gap-2 items-center text-cyan-400">
                  <Activity className="w-3 h-3 animate-spin" />
                  <span>Aguardando resposta da infra...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={status !== 'IDLE'}
                placeholder="Ex: Analisar contratos do mes..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 transition-all font-mono text-sm"
              />
              <button
                type="submit"
                disabled={status !== 'IDLE' || !prompt.trim()}
                className="absolute right-2 top-2 p-1.5 bg-cyan-900/30 text-cyan-400 rounded-md hover:bg-cyan-800/50 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-3 h-24 lg:h-[450px] relative flex justify-center items-center">
            <div className="lg:hidden absolute w-full h-full flex flex-col justify-center items-center opacity-50">
              <Network className="w-8 h-8 text-slate-600 mb-2" />
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Latencia: {status === 'IDLE' ? '0' : '12'}ms</div>
            </div>

            <canvas
              ref={canvasRef}
              className="w-full h-full opacity-80 z-10"
              style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))' }}
            />
          </div>

          <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col h-[450px] relative overflow-hidden">
            <div className={`absolute inset-0 bg-red-500/5 mix-blend-overlay pointer-events-none transition-opacity duration-1000 ${status === 'PROCESSING' ? 'opacity-100' : 'opacity-0'}`}></div>

            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Database className="text-purple-500 w-5 h-5" />
                <h2 className="text-white font-semibold tracking-wide">Infraestrutura Scala</h2>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-mono border ${status === 'PROCESSING' ? 'bg-pink-950/50 border-pink-500 text-pink-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                {status}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
                <div className="flex items-center gap-1 text-slate-500 mb-1 text-xs uppercase tracking-wider">
                  <Cpu className="w-3 h-3" /> Carga GPU
                </div>
                <div className={`text-2xl font-mono font-bold ${metrics.load > 80 ? 'text-pink-500 shadow-pink-500/50 drop-shadow-md' : 'text-slate-300'}`}>
                  {metrics.load.toFixed(0)}%
                </div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
                <div className="flex items-center gap-1 text-slate-500 mb-1 text-xs uppercase tracking-wider">
                  <ThermometerIcon status={status} /> Temp
                </div>
                <div className={`text-2xl font-mono font-bold ${metrics.temp > 70 ? 'text-orange-500 shadow-orange-500/50 drop-shadow-md' : 'text-slate-300'}`}>
                  {metrics.temp.toFixed(1)}deg
                </div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
                <div className="flex items-center gap-1 text-slate-500 mb-1 text-xs uppercase tracking-wider">
                  <Zap className="w-3 h-3 text-yellow-500" /> Power
                </div>
                <div className={`text-2xl font-mono font-bold ${metrics.power > 10 ? 'text-yellow-400 shadow-yellow-400/50 drop-shadow-md' : 'text-slate-300'}`}>
                  {metrics.power.toFixed(1)}M
                </div>
              </div>
            </div>

            <div className="flex-grow flex justify-center gap-4 relative z-10">
              {[0, 1, 2].map((rackId) => (
                <div key={rackId} className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-md p-2 w-24 shadow-inner">
                  <div className="text-[9px] text-center text-slate-600 mb-2 font-mono">RACK {rackId + 1}</div>
                  <div className="flex-grow flex flex-col gap-1">
                    {Array.from({ length: 8 }).map((_, bladeIdx) => {
                      const absoluteIdx = rackId * 8 + bladeIdx;
                      const isActive = activeBlades.includes(absoluteIdx);
                      return (
                        <div
                          key={bladeIdx}
                          className={`h-full rounded-sm border transition-all duration-75 flex items-center justify-end px-1 ${isActive ? 'bg-pink-600/20 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]' : 'bg-slate-900 border-slate-800'}`}
                        >
                          <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white shadow-[0_0_5px_#fff]' : 'bg-slate-700'}`}></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-center">
                    <Wind
                      className={`w-5 h-5 text-cyan-500/50 ${status === 'PROCESSING' ? 'animate-[spin_0.2s_linear_infinite] text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'animate-[spin_4s_linear_infinite]'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `,
        }}
      />
    </div>
  );
}

function ThermometerIcon({ status }) {
  return (
    <svg
      className={`w-3 h-3 ${status === 'PROCESSING' ? 'text-red-500 animate-pulse' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}
