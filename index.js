const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
mongoose.connect('mongodb://127.0.0.1:27017/board')
    .then(() => {
        console.log(
            'MONGO CONNECTION OPEN!')
    })
    .catch(err => {
        console.log('error caused!')
        console.log(err)
    })
const Post = require('./model/Post.js')
const Comment = require('./model/Comment.js')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

//initial settings

app.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('home.ejs', { posts })
})

//homepage

app.get('/contents/:id', async (req, res) => {
    const { id } = req.params
    const posts = await Post.findById(id).populate('postComment')
    res.render('contents.ejs', { posts })

})

app.post('/contents/:id/comment', async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.postComment)
    post.postComment.push(comment)
    await comment.save()
    await post.save()
    res.redirect(`/contents/${post._id}`)
})

app.delete('/contents/:id/comment/:commentId', async (req, res) => {
    const { id, commentId } = req.params
    await Post.findByIdAndUpdate(id)
    await Comment.findByIdAndDelete(req.params.commentId)
    res.redirect(`/contents/${id}`)
})
//contents

app.get('/newpost', (req, res) => {
    res.render('newpost.ejs')
})


app.post('/', async (req, res) => {
    const newpost = new Post(req.body)
    await newpost.save()
    res.redirect('/')
})
//add new post 

app.delete('/contents/:id', async (req, res) => {
    const { id } = req.params
    const delpost = await Post.findByIdAndDelete(id)
    res.redirect('/')
})

//Delete post

app.get('/update/:id', async (req, res) => {
    const { id } = req.params
    const udtPost = await Post.findById(id)
    res.render('update.ejs', { udtPost })
})

app.put('/update/:id', async (req, res) => {
    const { id } = req.params
    const udtPost = await Post.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    res.redirect(`/contents/${udtPost._id}`)
})

//Update post


app.listen(4000, () => console.log('Listening on port 4000'))