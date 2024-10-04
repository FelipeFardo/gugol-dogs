'use client'

import { motion, useAnimation, useInView } from 'framer-motion'
import { ArrowRight, Dog, Edit, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  content: string
}

function FeatureCard({ icon: Icon, title, content }: FeatureCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card className="h-full border-none bg-white/5 backdrop-blur-lg">
        <CardContent className="flex h-full flex-col pt-6">
          <Icon className="mx-auto mb-4 h-16 w-16 text-white" />
          <h3 className="mb-2 text-2xl font-bold text-gray-300">{title}</h3>
          <p className="flex-grow text-gray-400">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Home() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [controls, isInView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  const features: FeatureCardProps[] = [
    {
      icon: Edit,
      title: 'Edição Colaborativa',
      description:
        'Veja as mudanças instantaneamente, como se estivesse ao lado do seu colega.',
    },
    {
      icon: Users,
      title: 'Gestão de Equipe',
      description:
        'Organize sua equipe com facilidade e mantenha todos sincronizados.',
    },
    {
      icon: Zap,
      title: 'Velocidade Incomparável',
      description:
        'Nosso sistema garante que você nunca perca o ritmo do trabalho.',
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* <ParticleEffect /> */}
      <nav className="container relative z-10 mx-auto flex items-center justify-between p-6">
        <motion.div
          className="flex items-center space-x-2"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Dog size={32} className="text-white" />
          <span className="text-2xl font-bold">Gugol Dogs</span>
        </motion.div>
        <motion.div
          className="space-x-4"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="hover:bg-white/10 hover:text-gray-400"
          >
            Recursos
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-white/10 hover:text-gray-400"
          >
            Preços
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-white/10 hover:text-gray-400"
          >
            Contato
          </Button>
        </motion.div>
      </nav>

      <main className="container relative z-10 mx-auto px-6 py-12 text-center">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.h1
            className="mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-7xl font-extrabold text-transparent"
            variants={itemVariants}
          >
            Edição em Tempo Real
            <br />
            Redefinida
          </motion.h1>
          <motion.p
            className="mb-8 text-2xl text-gray-400"
            variants={itemVariants}
          >
            Colaboração instantânea que transforma a maneira como sua equipe
            trabalha.
          </motion.p>
          <motion.div
            className="mb-12 flex justify-center space-x-4"
            variants={itemVariants}
          >
            <Button
              size="lg"
              asChild
              className="transform bg-white text-black transition duration-300 hover:scale-105 hover:bg-gray-200"
            >
              <Link href="/auth/sign-in">Comece Agora</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="transform bg-white text-black transition duration-300 hover:scale-105 hover:bg-gray-200"
            >
              Ver Demonstração
            </Button>
          </motion.div>
        </motion.div>

        <RealtimeDemo />

        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="mb-10 text-4xl font-bold">Recursos Inovadores</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="mb-10 text-4xl font-bold">
            Junte-se à Revolução Gugol Dogs
          </h2>
          <div className="mx-auto max-w-md">
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="border-gray-700 bg-white/10 text-white placeholder-gray-500"
              />
              <Button className="bg-white text-black hover:bg-gray-200">
                Inscrever-se <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="container relative z-10 mx-auto px-6 py-8 text-center text-gray-500">
        <p>&copy; 2024 Gugol Dogs. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

// interface Particle {
//   x: number
//   y: number
//   size: number
//   speedX: number
//   speedY: number
//   update: () => void
//   draw: (ctx: CanvasRenderingContext2D) => void
// }

// function ParticleEffect() {
//   const canvasRef = useRef<HTMLCanvasElement>(null)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext('2d')
//     if (!ctx) return

//     canvas.width = window.innerWidth
//     canvas.height = window.innerHeight

//     const particles: Particle[] = []

//     class ParticleImpl implements Particle {
//       constructor(
//         public x: number,
//         public y: number,
//       ) {
//         this.size = Math.random() * 2 + 0.1
//         this.speedX = Math.random() * 1 - 0.5
//         this.speedY = Math.random() * 1 - 0.5
//       }

//       update() {
//         this.x += this.speedX
//         this.y += this.speedY
//         if (this.size > 0.1) this.size -= 0.01
//       }

//       draw(ctx: CanvasRenderingContext2D) {
//         ctx.fillStyle = 'rgba(200,200,200,0.5)'
//         ctx.beginPath()
//         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
//         ctx.fill()
//       }
//     }

//     function handleParticles() {
//       for (let i = 0; i < particles.length; i++) {
//         particles[i].update()
//         particles[i].draw(ctx)
//         if (particles[i].size <= 0.1) {
//           particles.splice(i, 1)
//           i--
//         }
//       }
//     }

//     function animate() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height)
//       handleParticles()
//       requestAnimationFrame(animate)
//     }

//     const handleMouseMove = (e: MouseEvent) => {
//       for (let i = 0; i < 2; i++) {
//         particles.push(new ParticleImpl(e.x, e.y))
//       }
//     }

//     window.addEventListener('mousemove', handleMouseMove)

//     animate()

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove)
//     }
//   }, [])

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         pointerEvents: 'none',
//       }}
//     />
//   )
// }

const frasesGugolDogs = [
  'Bem-vindo ao Gugol Dogs: onde até os cachorros podem compartilhar documentos, mas nem sempre sabem o que estão fazendo!',
  'Bem-vindo ao Gugol Dogs: onde a edição é coletiva, mas o caos é garantido!',
  'Bem-vindo ao Gugol Dogs: documentos que até um cachorro entenderia... ou não!',
  'Bem-vindo ao Gugol Dogs: compartilhando documentos com a precisão de um golden retriever!',
  'Bem-vindo ao Gugol Dogs: onde a única coisa mais bagunçada que seus documentos são os nomes dos arquivos!',
  'Bem-vindo ao Gugol Dogs: porque até os cães merecem uma chance de bagunçar seu trabalho.',
  'Bem-vindo ao Gugol Dogs: onde cada documento tem mais revisões do que um vira-lata tem donos.',
  'Bem-vindo ao Gugol Dogs: compartilhando documentos do jeito que só um cachorro sem foco faria.',
  'Bem-vindo ao Gugol Dogs: porque nem só de biscoitos vivem as colaborações!',
  'Bem-vindo ao Gugol Dogs: onde todo documento parece ser salvo com a pata errada.',
  'Bem-vindo ao Gugol Dogs: quem precisa de organização quando se tem entusiasmo canino?',
  'Bem-vindo ao Gugol Dogs: onde a única coisa organizada é a confusão!',
  "Bem-vindo ao Gugol Dogs: porque até os cachorros sabem que 'salvar como' é para os fracos.",
  'Bem-vindo ao Gugol Dogs: colaborando como um cão de guarda... que se distrai fácil.',
  'Bem-vindo ao Gugol Dogs: onde o único backup é o latido do vizinho.',
  'Bem-vindo ao Gugol Dogs: quem disse que só humanos podem perder arquivos importantes?',
  "Bem-vindo ao Gugol Dogs: onde até o cachorro sabe que 'salvar automaticamente' é a melhor função.",
  'Bem-vindo ao Gugol Dogs: porque todo bom documento merece uma bagunça canina.',
  'Bem-vindo ao Gugol Dogs: onde o compartilhamento é ágil, mas a organização é... digamos, animal!',
  'Bem-vindo ao Gugol Dogs: porque quem precisa de ordem quando se tem uma boa dose de caos colaborativo?',
  'Bem-vindo ao Gugol Dogs: arquivos compartilhados com a precisão de uma busca por ossos no quintal.',
]

function RealtimeDemo() {
  const [text, setText] = useState<string>('')
  const [cursorPosition, setCursorPosition] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })

  useEffect(() => {
    const indexAleatorio = Math.floor(Math.random() * frasesGugolDogs.length)
    setText(frasesGugolDogs[indexAleatorio])
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prevText) => {
        const words = prevText.split(' ')
        const randomIndex = Math.floor(Math.random() * words.length)
        words[randomIndex] = words[randomIndex].toUpperCase()
        return words.join(' ')
      })
      setCursorPosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative mt-12 h-64 overflow-hidden rounded-lg border border-gray-700 bg-white/5 p-6 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-lg text-gray-300"
      >
        {text}
      </motion.div>
      <motion.div
        className="absolute h-3 w-3 rounded-full bg-white"
        animate={{ x: `${cursorPosition.x}%`, y: `${cursorPosition.y}%` }}
        transition={{ type: 'spring', stiffness: 100 }}
      />
    </div>
  )
}
