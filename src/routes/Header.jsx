import { Outlet, Link } from "react-router-dom"

const Header = () => {
    return(
        <>
            <nav>
                <Link style={{ color: "white" }} to="/">
                    Home
                </Link>
            </nav>
            <Outlet />
        </>
    )
}

export default Header;