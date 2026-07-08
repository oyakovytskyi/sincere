export type WishItem = {
  id: string
  image: string
  orbitAngle: number
  orbitRadius: number
  orbitDuration: number
  orbitDirection: 1 | -1
  shortLabel: string
  title: string
  message: string
}

const SHARED_ORBIT_DURATION = 48
const SHARED_ORBIT_DIRECTION = 1 as const

const WISH_CONTENT = [
  {
    id: 'wish-together',
    image: '/together.webp',
    shortLabel: 'Ми',
    title: 'Ми ❤️',
    message:
      'Таня — це найпрекрасніше і найцінніше, що в мене є. Хочу побажати тобі всього-всього — нехай усе збувається.',
  },
  {
    id: 'wish-burgers',
    image: '/burgers.webp',
    shortLabel: 'Їжа',
    title: 'Пристрасть',
    message:
      'Бажаю тобі ще раз спробувати ці смачні бургери і багато інших страв. Бажано Too Good To Go за мало грошей.',
  },
  {
    id: 'wish-salmon',
    image: '/salmon.webp',
    shortLabel: 'Смак',
    title: 'Пристрасть два',
    message:
      'Бажаю, щоб у тебе завжди був шматок смачного лосося адже радощів від нього не мало.',
  },
  {
    id: 'wish-group',
    image: '/group.webp',
    shortLabel: 'Друзі',
    title: 'В компанії',
    message:
      'Бажаю тобі ще більше друзів і таких моментів, коли можна просто бути разом і проводити час.',
  },
  {
    id: 'wish-skiing',
    image: '/skiing.webp',
    shortLabel: 'Гори',
    title: 'Щорічні схили',
    message:
      'Бажаю тобі ще тих неймовірних краєвидів у горах і щоб завжди виходило покататись на лижах.',
  },
  {
    id: 'wish-stretch',
    image: '/stretch.webp',
    shortLabel: 'Спорт',
    title: 'Спорт',
    message:
      'Таня найгарніша і найкраща спортсменка. Скоро вже Сніжана буде дивитись твої уроки',
  },
  {
    id: 'wish-posture',
    image: '/posture.webp',
    shortLabel: 'Кадр',
    title: 'Ідеальна постава',
    message:
      'Роки роботи з поставою дають свої знаки!',
  },
  {
    id: 'wish-travel',
    image: '/travel.webp',
    shortLabel: 'Подорожі',
    title: 'Більше і більше',
    message:
      'Світ такий великий, і я бажаю нам побачити його ще більше. Нові міста, нові країни, нові пригоди нехай кожна подорож буде незабутньою.',
  },
] as const

const WISH_COUNT = WISH_CONTENT.length
const ORBIT_SECTOR = (Math.PI * 2) / WISH_COUNT

export const WISH_ITEMS: WishItem[] = WISH_CONTENT.map((wish, index) => ({
  ...wish,
  orbitAngle: index * ORBIT_SECTOR,
  orbitRadius: index % 2 === 0 ? 1.25 : 1.5,
  orbitDuration: SHARED_ORBIT_DURATION,
  orbitDirection: SHARED_ORBIT_DIRECTION,
}))
