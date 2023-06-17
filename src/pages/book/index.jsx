import { useLocation } from "react-router-dom"
import './style.scss'
import ViewDetail from "../../components/book/ViewDetail";
import { getBookbyID } from "../../services/apiService";
import { useEffect, useState } from "react";


const BookPage = () => {
    let location = useLocation()
    const [dataBook, setDataBook] = useState([])

    let params = new URLSearchParams(location.search);
    const id = params?.get("id")

    useEffect(() => {
        fetchBook(id)
    }, [id])

    const fetchBook = async (id) => {
        const res = await getBookbyID(id);
        console.log(res)
        if (res && res.data) {
            let raw = res.data
            raw.items = getImages(raw)
            setTimeout(() => {
                setDataBook(raw)
            }, 3000)
        }
    }

    const getImages = (raw) => {
        const images = [];
        if (raw.thumbnail) {
            images.push(
                {
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image"
                }
            )
        }
        if (raw.slider) {
            raw.slider?.map(item => {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    }
                )
            })
        }
        return images
    }

    return (
        <>
            <ViewDetail dataBook={dataBook} />
        </>
    )
}

export default BookPage