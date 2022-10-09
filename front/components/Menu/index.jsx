import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Avatar } from './Avat';
import { MenuItem } from './MenuItem';
import { routes, notShowing } from './routes';

import { FiMenu, FiChevronLeft } from 'react-icons/fi';
import styles from './style.module.scss';
import { toClassName } from '@utils/toClassName';

const Menu = () => {
	const router = useRouter();

	const [isFull, setIsFull] = useState(false);
	const [selected, setSelected] = useState(null);

	useEffect(() => {
		routes.forEach((el, idx) => {
			if (new RegExp(`^${el.path}`, 'g').test(router.pathname))
				setSelected(idx);
		});
	}, [router]);

	return (
		<div
			className={toClassName(
				styles.menu,
				notShowing.includes(router.pathname) && styles.menu_hidden
			)}
			style={{
				width: isFull ? 250 : 80,
			}}>
			<div className={styles['menu-items']}>
				<div
					className={styles['menu-header']}
					onClick={() => setIsFull((prev) => !prev)}>
					{isFull ? (
						<>
							<FiChevronLeft
								className={styles['menu-header-icon']}
							/>
							<span>Меню</span>
						</>
					) : (
						<FiMenu className={styles['menu-header-icon']} />
					)}
				</div>
				{routes.map((el, idx) => (
					<MenuItem
						title={el.name}
						isFull={isFull}
						key={el.path}
						icon={el.icon}
						selected={idx === selected}
						action={() => {
							setSelected(idx);
							router.push(el.path);
						}}
					/>
				))}
			</div>
			<div className={styles['menu-avatar']}>
				<Avatar />
			</div>
		</div>
	);
};

export { Menu };
