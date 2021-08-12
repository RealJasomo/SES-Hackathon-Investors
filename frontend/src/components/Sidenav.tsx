import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import firebase, { usersRef } from '@fire';
import { AuthenticationContext } from '@contexts/AuthContext';
import User from '@interfaces/User';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { ReactComponent as Logo } from '@res/logo.svg';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ForumIcon from '@material-ui/icons/Forum';
import styles from './Sidenav.module.scss';
import Search from '@material-ui/icons/Search';
import Settings from '@material-ui/icons/Settings';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import BusinessIcon from '@material-ui/icons/Business';
import { Avatar } from '@material-ui/core';

type SideNavLink = Omit<ISidenavItemProps, 'active'>;
const sideNavLinks: SideNavLink[] = [{
    icon: <DashboardIcon className={styles.icon}/>,
    name: 'Dashboard',
    link: '/dashboard',
},{
    icon: <Search className={styles.icon}/>,
    name: 'Search',
    link: '/search',
},{
    icon: <ShowChartIcon className={styles.icon}/>,
    name: 'Investments',
    link: '/investments',
},{
    icon: <BusinessIcon className={styles.icon}/>,
    name: 'Startups',
    link: '/startups',
},{
    icon: <ForumIcon className={styles.icon}/>,
    name: 'Messages',
    link: '/messages',
},{
    icon: <Settings className={styles.icon}/>,
    name: 'Settings',
    link: '/settings',
}];

export default function Sidenav(){
    const [active, setActive] = useState<number>(0);
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const history = useHistory();
    const auth = useContext(AuthenticationContext);
    const avatarRef = useRef(null);
    

    const updateActive = (location: any) => {
        const link = sideNavLinks.findIndex(link => link.link === history.location.pathname);
        if(link >= 0){
            setActive(link);
        }
    }

    useEffect(() => {
        if(auth.user){
          usersRef.doc(auth.user.uid).onSnapshot(snap => {
              if(snap.exists){
                  setUser(snap.data() as User);
              }
        });
        }
    }, [auth.user]);

    useEffect(() => {
        if(history){
            updateActive(history.location);
            return history.listen(updateActive);
        }
    }, [history]);

    const toggleProfileMenu = () => {
        setMenuOpen(open => !open);
    }
    
    const handleSignout = async () => {
        await firebase.auth().signOut();
    }

    return(
    <div className={styles.sideNav}>
        <div className={styles.brand}>
            <div className={styles.logoContainer}>
                <Logo className={styles.logo}/>
            </div>
            <p className={styles.brandText}>LaunchPad</p>
        </div>
        <div className={styles.profile}>
            <Avatar ref={avatarRef} onClick={toggleProfileMenu} alt="Profile" {...(user&&{src: user.profilePhoto})} className={styles.avatar}/>
            <Menu
                anchorEl={avatarRef.current}
                open={menuOpen}
                onClose={toggleProfileMenu}>
                <MenuItem onClick={handleSignout}>Sign Out</MenuItem>
            </Menu>
            <div className={styles.info}>
                <p>{user?.firstName ?? 'First Name'}, {user?.lastName ?? 'Last Name'}</p>
                <p>$ {user?.balance?.toLocaleString() ?? '0'}</p>
            </div>
        </div>
        <div className={styles.navLinks}>
            {sideNavLinks.map((link, idx) => <SidenavItem key={idx} {...link} active={active===idx}/>)}
        </div>
    </div>);
}

interface ISidenavItemProps{
    icon: React.ReactNode,
    name: string,
    link?: string,
    onClick?: () => void,
    active: boolean,
}

export function SidenavItem(props: ISidenavItemProps){
    const history = useHistory();
    return (
    <div onClick={props.onClick || (() => history.push(props.link ?? '/dashboard'))} className={`${styles.sideNavItem} ${props.active&&styles.active}`}>
        {props.icon} <h1>{props.name}</h1>
    </div>);
}