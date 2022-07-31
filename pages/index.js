import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setAllTags } from '../redux/userSlice';
import homeStyles from '../styles/home/Home.module.scss'
import FolderImg from '../components/FolderImg';

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const allTags = useSelector(state => state.user.allTags);
  const userID = useSelector(state => state.user.userID);

  const updateTagWeight = async (tag) => {
    const res = await fetch('/api/updateTagWeight', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID: userID,
        tagName: tag
      })
    })

    const newTagList = await res.json()
    sessionStorage.setItem('allTags', JSON.stringify(newTagList))
    dispatch(setAllTags(newTagList))
  }

  const handleFolderClick = (tag) => {
    sessionStorage.setItem('currentTag', tag)

    updateTagWeight(tag)

    router.push(`/tagCollection/${tag}`)
  }

  return (
    <div className={homeStyles.container}>
      <h1>Memories</h1>

      <div className={homeStyles.tagFoldersContainer}>
        {
          allTags?.map((tag, i) => (
            <div onClick={() => handleFolderClick(tag.name)} key={i} className={homeStyles.singleTagFolder}>
              <FolderImg />
              <h4 className={homeStyles.folderName}>{tag.name}</h4>
              <h5 className={homeStyles.photoCount}>{tag.count}</h5>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home;