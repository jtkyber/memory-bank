import Nav from '../components/Navigation';
import layoutStyles from '../styles/layoutStyles/Layout.module.scss';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
    const bgImage = useSelector(state => state.user.bgImage)
    const isMobile = useSelector(state => state.device.isMobile)

    const bgStyling = {
        backgroundImage: (bgImage?.includes('https://memory-bank-bucket.s3.amazonaws.com')) ? `url('${bgImage}')` : 'url("/defaultbg.jpg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    }
    
    return (
        <div style={bgStyling} className={`${layoutStyles.container} ${isMobile ? layoutStyles.mobile : null}`}>
            <Nav />
            <main className={layoutStyles.pageContainer}>
                {children}
            </main>
        </div>
    );
};

export default Layout;