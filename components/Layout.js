import Nav from '../components/Navigation';
import layoutStyles from '../styles/_Layout.module.scss';

const Layout = ({ children }) => {
    return (
        <div className={layoutStyles.container}>
            <div className={layoutStyles.navContainer}>
                <Nav />
            </div>
            <main className={layoutStyles.pageContainer}>
                {children}
            </main>
        </div>
    );
};

export default Layout;