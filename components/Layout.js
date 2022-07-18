import Nav from '../components/Navigation';
import layoutStyles from '../styles/_Layout.module.scss';

const Layout = ({ children }) => {
    return (
        <div className={layoutStyles.container}>
            <Nav />
            <main className={layoutStyles.pageContainer}>
                {children}
            </main>
        </div>
    );
};

export default Layout;