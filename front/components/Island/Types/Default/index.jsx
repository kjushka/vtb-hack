import { Button, Svg } from '@components';
import { toClassName } from '@utils';

import { RiCopperCoinFill } from 'react-icons/ri';
import styles from './style.module.scss';

const DefaultIsland = ({
	className = '',
	badge = '',
	header = 'Header',
	description = 'Description',
	buttonText = 'Button',
	price = null,
	progress = null,
	onButtonClick = () => {},
}) => {
	return (
		<div className={toClassName(styles.island, className)}>
			{!!progress && (
				<div className={styles.island_progress}>
					<div
						className={styles.island_progress__filled}
						style={{
							width: `${progress}%`,
						}}>
						<span>{progress}%</span>
					</div>
				</div>
			)}
			<div className={styles.island_circle}>
				<Svg type='union' className={styles.island_circle_union} />
			</div>
			{badge && <span className={styles.island_badge}>{badge}</span>}
			<div className={styles.island_content}>
				<div className={styles.island_content_text}>
					<span className={styles.island_content_text_header}>
						{header}
					</span>
					<span className={styles.island_content_text_description}>
						{description}
					</span>
				</div>
				<div className={styles.island_content_footer}>
					<Button
						className={styles.island_content_footer_button}
						type='border'
						onClick={onButtonClick}>
						{buttonText}
					</Button>
					{price && (
						<div className={styles.island_content_footer_price}>
							<RiCopperCoinFill
								size={24}
								className={
									styles['island_content_footer_price_icon']
								}
							/>
							<span>{price}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export { DefaultIsland };
