import React, { FC } from 'react';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to={'/'}
            className={({ isActive }) =>
              clsx({ [styles.link]: true, [styles.link_active]: isActive })
            }
            state={{ previousLocation: location }}
          >
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            to={'/feed'}
            className={({ isActive }) =>
              clsx({ [styles.link]: true, [styles.link_active]: isActive })
            }
            state={{ previousLocation: location }}
          >
            <ListIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <NavLink
          to={'/profile'}
          className={({ isActive }) =>
            clsx({
              [styles.link]: true,
              [styles.link_position_last]: true,
              [styles.link_active]: isActive
            })
          }
          state={{ previousLocation: location }}
        >
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
          {/*<div className={styles.link_position_last}>*/}
          {/*  */}
          {/*</div>*/}
        </NavLink>
      </nav>
    </header>
  );
};
