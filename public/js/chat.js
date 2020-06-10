const socket = io()

//dom elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('#message_input')
const $usernameFormInput = $messageForm.querySelector('#username_input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (data) => {
    console.log(data)
    const html = Mustache.render(messageTemplate, {username: data.username, message: data.message, createdAt: moment(data.createdAt).format('h:mm a')})
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (form) => {
    form.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = form.target.message.value
    const username = form.target.username.value

    socket.emit('sendMessage', {username, message}, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ""
        $messageFormInput.focus()

        if (error) console.log(error)
        else console.log('Delivered!')
    })
})