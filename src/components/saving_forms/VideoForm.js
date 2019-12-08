import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useField } from '../../hooks';
import { OwnLoader } from '../OwnLoader';

export const VideoForm = ({ itemService }) => {
    const [author, authorReset] = useField('text')
    const [otsikko, otsikkoReset] = useField('text')
    const [url, urlReset] = useField('text')
    const [relatedCourses, relatedCoursesReset] = useField('text')
    const [kommentti, kommenttiReset] = useField('text')
    const [showFullForm, setShowFullForm] = useState(false)
    const [loader, setLoader] = useState(false)
    const [loadErrorMessage, setLoadErrorMessage] = useField()

    const handleSubmit = async (e) => {
        e.preventDefault();

        await itemService.create({
            id: Math.floor((Math.random() * 1000) + 1),
            author: author.value,
            title: otsikko.value,
            url: url.value,
            relatedCourses: relatedCourses.value.split(","),
            comment: kommentti.value
        }, "videos")

        authorReset();
        otsikkoReset();
        urlReset();
        relatedCoursesReset();
        kommenttiReset();
    }

    const autoFillWithYoutubeUrl = (e) => {
        e.preventDefault();

        setLoader(true)
        // Parse from url
        if (url.value) {
            const id = url.value.toLowerCase().includes('youtube') ? url.value.split("?")[1].split("&")[0].split("=")[1] : url.value.split("//")[1].split("/")[1]
            console.log("TCL: autoFillWithYoutubeUrl -> id", id)
            fetch('https://www.googleapis.com/youtube/v3/videos/?part=snippet&id=' + id.trim() + '&key=' + process.env.REACT_APP_YOUTUBE_API_KEY)
                .then((response) => response.json())
                .then((json) => {
                    setLoadErrorMessage()
                    const data = json['items']

                    if (!data) {
                        loadError()
                        return
                    }

                    const details = data[0]['snippet']
                    authorReset(details['channelTitle'])
                    otsikkoReset(details['title'])
                    setLoader(false)
                    setShowFullForm(true)
                })
                .catch(() => loadError)
        } else {
            setLoadErrorMessage("URL can't be empty")
        }
    }

    const loadError = () => {
        setLoader(false)
        setLoadErrorMessage("Couldn't find anything with given URL")
        setTimeout(() => {
            setLoadErrorMessage()
        }, 5000)
    }

    return (
        <Form onSubmit={handleSubmit} inverted>
            <Form.Field>
                <label>Url</label>
                <input {...url} />
            </Form.Field>

            <Button primary onClick={autoFillWithYoutubeUrl}>Hae tiedot</Button>

            <p style={{ color: 'red' }}>{loadErrorMessage.value}</p>

            {loader && <OwnLoader />}

            {showFullForm &&
                <div>
                    <Form.Field>
                        <label>Kirjoittaja</label>
                        <input {...author} />
                    </Form.Field>

                    <Form.Field>
                        <label>Otsikko</label>
                        <input {...otsikko} />
                    </Form.Field>
                </div>
            }

            <Form.Field>
                <label>Related courses</label>
                <input {...relatedCourses} />
            </Form.Field>

            <Form.Field>
                <label>Kommentti</label>
                <input {...kommentti} />
            </Form.Field>

            <Button positive type="submit" value="Submit">Lähetä</Button>
        </Form>
    )
}