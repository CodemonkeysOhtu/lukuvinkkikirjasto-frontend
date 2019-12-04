import React, { useEffect, useState } from 'react';
import { Divider, Header, Input, Search } from 'semantic-ui-react';
import { Books } from './Books';
import { ItemsTable } from './ItemsTable';
import { Videos } from './Videos';

export const ListEntries = ({ items, selected }) => {
    const [allItems, setAllItems] = useState([])
    const [filteredItems, setFilteredItems] = useState([])
    const [searchQuery, setSearchQuery] = useState()

    useEffect(() => {
        setSearchQuery('')
        if ( items !== undefined && items.length !== 0) {
            switch (selected) {
                case 0:
                    setAllItems(items.books)
                    setFilteredItems(items.books)
                    break
                case 1:
                    setAllItems(items.videos)
                    setFilteredItems(items.videos)
                    break
                case 2:
                    setAllItems(items.articles)
                    setFilteredItems(items.articles)
                    break
                case 3:
                    setAllItems(items.blogposts)
                    setFilteredItems(items.blogposts)
                    break
                default:
                    setAllItems([])
                    setFilteredItems([])
            }
        }
    }, [items, selected])

    const search = (event) => {
        setSearchQuery(event.target.values)
        const tmp = []
        allItems.forEach((item)=>{
            Object.values(item).forEach((val)=>{
                if(val.toString().toLowerCase().includes(event.target.value.toLowerCase()) && !tmp.includes(item)){
                    tmp.push(item)
                }
            })
        })
        setFilteredItems(tmp)
    }

    return (
        <>
            <Divider horizontal>
                <Header as='h2'>
                    {selected === 0 ? 'Books' : selected === 1 ? 'Videos' : selected === 2 ? 'Articles' : selected === 3 ? 'Blog posts' : 'All items'}
                </Header>
            </Divider>
            <Input 
                style={{paddingTop:10,marginBottom:50}}
                onChange={search}
                value={searchQuery}
                placeholder={"Search"}
            />

            {selected === 0 ? <Books books={filteredItems} /> :
                selected === 1 ? <Videos videos={filteredItems} /> :
                    selected === 2 ? <div>Articles</div> :
                        selected === 3 ? <div>Blogposts</div> :
                            <ItemsTable items={items} />}
        </>
    )
}

