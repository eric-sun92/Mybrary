const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

// All Authors Route
router.get('/', async (req, res) => {
    //in get req, use req.query
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ""){
        searchOptions.name = new RegExp(req.query.name, "i")
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', {
        author: new Author()
    })
})


// Create Author Route
router.post('/', async (req, res) => {
    //in a post req, use req.body
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage:  'error creating author'
        })
    }
})


    // author.save((err, newAuthor) => {
    //     if(err) {
    //         let locals = { errorMessage: 'error creating author'}
    //         res.render('authors/new', {
    //             author: author,
    //             errorMessage: locals.errorMessage
    //         })
    //     } else {
    //         // res.redirect(`authors/${newAuthor.id}`)
    //         res.redirect('/authors')
    //     }
    // })


    router.get('/:id', async(req, res) => {
        try {   
            const author = await Author.findById(req.params.id)
            const booksByAuthor = await Book.find({author: author.id}).limit(6)

            res.render('authors/show', {
                author: author,
                booksByAuthor: booksByAuthor
            })
        } catch {
            res.redirect('/')
        }
    })

    router.get('/:id/edit', async (req, res) => {
        try {
            const author = await Author.findById(req.params.id)
            res.render('authors/edit', { author: author})

        } catch {
            res.redirect('/authors')
        }
    })

    router.put('/:id', async (req, res) => {
        let author
        try {
            author = await Author.findById(req.params.id)
            author.name = req.body.name
            await author.save()
            res.redirect(`/authors/${author.id}`)    
        } catch {
            if(author == null) {
                res.redirect('/')
            }
            else {
                res.render('authors/edit', {
                    author: author,
                    errorMessage:  'error updating author'
                })
            }
        }
    })
    
    router.delete('/:id', async (req, res) => {
        let author
        try {
            author = await Author.findById(req.params.id)
            await author.remove()
            res.redirect('/authors')    
        } catch {
            if(author == null) {
                res.redirect('/')
            }
            else {
                res.redirect(`/authors/${author.id}`)
            }
        }
    })



module.exports = router