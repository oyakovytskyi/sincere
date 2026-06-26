export type WishItem = {
  id: string
  orbitAngle: number
  orbitRadius: number
  avatarGradient: string
  imageGradient: string
  shortLabel: string
  title: string
  message: string
}

export const FLOATING_LABELS = [
  'З днем народження',
  'Святковий день',
  'Кохання мого життя',
  'Щасливого свята',
  'Я тебе кохаю',
  'Моє серце',
] as const

export const WISH_ITEMS: WishItem[] = [
  {
    id: 'wish-1',
    orbitAngle: 0.4,
    orbitRadius: 1.05,
    avatarGradient: 'linear-gradient(135deg, #f472b6, #c026d3)',
    imageGradient: 'linear-gradient(160deg, #fb7185 0%, #a855f7 50%, #ec4899 100%)',
    shortLabel: '💕',
    title: 'Для тебе',
    message:
      'Нехай цей день буде сповнений сміху, обіймів і моментів, які ти збережеш назавжди. Ти світло мого життя.',
  },
  {
    id: 'wish-2',
    orbitAngle: 1.8,
    orbitRadius: 1.22,
    avatarGradient: 'linear-gradient(135deg, #fbbf24, #f97316)',
    imageGradient: 'linear-gradient(160deg, #fcd34d 0%, #f97316 55%, #ef4444 100%)',
    shortLabel: '🎂',
    title: 'З днем народження',
    message:
      'Сьогодні ми святкуємо не лише ще один рік, а всю твою красу й доброту. Нехай на твоєму шляху завжди буде любов.',
  },
  {
    id: 'wish-3',
    orbitAngle: 3.1,
    orbitRadius: 0.92,
    avatarGradient: 'linear-gradient(135deg, #60a5fa, #818cf8)',
    imageGradient: 'linear-gradient(160deg, #38bdf8 0%, #6366f1 50%, #a78bfa 100%)',
    shortLabel: '✨',
    title: 'Моя зірка',
    message:
      'Ти сяєш особливим світлом. Нехай кожне бажання, яке ти загадаєш сьогодні, здійсниться найкращим чином.',
  },
  {
    id: 'wish-4',
    orbitAngle: 4.5,
    orbitRadius: 1.35,
    avatarGradient: 'linear-gradient(135deg, #34d399, #14b8a6)',
    imageGradient: 'linear-gradient(160deg, #6ee7b7 0%, #2dd4bf 50%, #0ea5e9 100%)',
    shortLabel: '🌸',
    title: 'З ніжністю',
    message:
      'Дякую, що ти є, і що робиш кожен день особливим. Бажаю тобі незабутнього дня народження.',
  },
  {
    id: 'wish-5',
    orbitAngle: 5.7,
    orbitRadius: 1.15,
    avatarGradient: 'linear-gradient(135deg, #f43f5e, #db2777)',
    imageGradient: 'linear-gradient(160deg, #fda4af 0%, #e11d48 50%, #be185d 100%)',
    shortLabel: '❤️',
    title: 'Кохання мого життя',
    message:
      'Ти моя найулюбленіша людина в усьому всесвіті. Нехай цей новий рік принесе тобі все, чого ти заслуговуєш.',
  },
  {
    id: 'wish-6',
    orbitAngle: 6.9,
    orbitRadius: 1.48,
    avatarGradient: 'linear-gradient(135deg, #e879f9, #d946ef)',
    imageGradient: 'linear-gradient(160deg, #f0abfc 0%, #c026d3 50%, #7c3aed 100%)',
    shortLabel: '🎁',
    title: 'Подарунок',
    message:
      'Найкращий подарунок - це бути поруч із тобою. Нехай сьогодні й завжди ти відчуваєш любов, цінність і щастя.',
  },
]
