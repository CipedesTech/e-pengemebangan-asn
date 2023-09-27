import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import PropTypes from 'prop-types';

import { HomeOutlined } from '@ant-design/icons';

function Breadcrumbs({ breadcrumbs }) {
  const { t } = useTranslation();

  if (!breadcrumbs) {
    return null;
  }

  return (
    <nav aria-label='breadcrumb'>
      <ol className='breadcrumb'>
        <li className='breadcrumb-item'>
          <Link legacyBehavior href='/'>
            <a><HomeOutlined /></a>
          </Link>
        </li>
        {breadcrumbs.length > 0 && (
          breadcrumbs.map((breadcrumb, key) => (
            <li className='breadcrumb-item' key={key}>
              {breadcrumbs.length === key + 1 ? (
                t(breadcrumb.breadcrumbName)
              ) : (
                <Link legacyBehavior href={breadcrumb.path}>
                  <a>{t(breadcrumb.breadcrumbName)}</a>
                </Link>
              )}
            </li>
          ))
        )}
      </ol>
    </nav>
  );
}

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Breadcrumbs;
