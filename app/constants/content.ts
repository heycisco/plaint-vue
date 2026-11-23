export const dialogVariants = [
  { id: 1, title: 'Нихуя не заполнено', style: 'alert' },
  { id: 2, title: 'Сообщение должно быть не короче слова «Пиздец»', style: 'alert' },
  {
    id: 3,
    title: 'Имя может напишешь?',
    style: 'question',
    answers: { ignore: 'Ну его нахуй', takeNote: 'А пожалуй стоит!' }
  },
  { id: 4, title: 'Такое длинное имя ни в один бланк не влезет', style: 'info' },
  { id: 5, title: 'Слишком длинная малява. Ну её нахуй', style: 'info' },
  { id: 6, title: 'Нужно осудить капитализм', style: 'info' },
  { id: 7, title: 'Ну че, полегчало?', style: 'success', finish: true }
] as const

export const formLabels = {
  message: 'Жалоба:',
  name: 'Имя:',
  criticism: 'Осуждаю мировой капитализм:',
  criticismAccept: 'Осуждаю!',
  sent: 'Отправить',
  reset: 'Очистить'
} as const

export const startCopy = {
  title: 'Товарищ!',
  mainDescription: [
    'Соседи который день сверлят? Начальник наорал? Отключили горячую воду? Болит зуб? Окружён идиотами?',
    'Ты попал по адресу! Именно здесь можно всё это излить в бездушную форму.',
    'Ответственно заявляем — все сообщения тщательно игнорируются, более того, они даже никуда не отправляются — никаких отличий от обычных жалоб.'
  ],
  startLink: 'Поехали!'
} as const

export const sentCopy = {
  message: ['Спасибо, товарищ!', 'Жалоба непременно будет проигнорирована!'],
  link: 'Ещё одну напишем?'
} as const

export const notFoundCopy = {
  link: 'В начало'
} as const