import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { Blogpost } from './Blogpost'

export const Blogposts = ({ blogs }) => {
    const [sortedBlogs, setSortedBlogs] = useState([])
    const [sortDirections, setSortDirections] = useState({
        author: true,
        title: true,
    })

    useEffect(() => {
        if (blogs !== undefined && blogs.length !== 0) {
            setSortedBlogs(blogs)
        }
        else setSortedBlogs([])
    }, [blogs])

    const sortByAuthor = () => {
        const clone = sortDirections.author ? _.sortBy(sortedBlogs, ['author']) : _.sortBy(sortedBlogs, ['author']).reverse()
        setSortedBlogs(clone)
        setSortDirections(prev => ({
            ...prev,
            author: !prev.author
        }))
    }

    const sortByTitle = () => {
        const clone = sortDirections.title ? _.sortBy(sortedBlogs, ['title']) : _.sortBy(sortedBlogs, ['title']).reverse()
        setSortedBlogs(clone)
        setSortDirections(prev => ({
            ...prev,
            title: !prev.title
        }))
    }

    return (
        <div>
            <Button.Group basic size='large' color='green' inverted style={{display:'flex', marginBottom: '10px'}}>
                <Button onClick={sortByAuthor}>Sort by author</Button>
                <Button onClick={sortByTitle}>Sort by title</Button>
            </Button.Group>
            {sortedBlogs.map(b => <Blogpost key={b.id} blogpost={b} />)}
        </div>
    )
}