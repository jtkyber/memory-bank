import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import homeStyles from '../styles/_Home.module.scss'
import FolderImg from '../components/FolderImg';

const Home = () => {
  const router = useRouter();
  const allTags = useSelector(state => state.user.allTags);

  const handleFolderClick = (tag) => {
    sessionStorage.setItem('currentTag', tag)
    router.push(`/tagCollection/${tag}`)
  }

  return (
    <div className={homeStyles.container}>
      <h1>Memories</h1>

      <div className={homeStyles.tagFoldersContainer}>
        {
          allTags?.map((tag, i) => (
            <div onClick={() => handleFolderClick(tag)} key={i} className={homeStyles.singleTagFolder}>
              <FolderImg />
              <h4 className={homeStyles.folderName}>{tag}</h4>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home;