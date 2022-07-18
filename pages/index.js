import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setPhotos, addTag, resetTags } from '../redux/photoSlice';
import homeStyles from '../styles/_Home.module.scss'

const Home = () => {
  const router = useRouter();
  const userID = useSelector(state => state.user.userID);
  const allTags = useSelector(state => state.user.allTags);

  useEffect(() => {
    
  }, [])

  return (
    <div className={homeStyles.container}>
      <h1>Memories</h1>

      <div className={homeStyles.tagFoldersContainer}>
        {
          allTags?.map((tag, i) => (
            <div onClick={() => router.push(`/tagCollection/${tag}`)} key={i} className={homeStyles.singleTagFolder}>
              <h3 className={homeStyles.folderName}>{tag}</h3>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home;