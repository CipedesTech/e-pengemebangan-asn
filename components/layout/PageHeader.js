import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Typography } from 'antd';
import Breadcrumbs from 'components/common/Breadcrumbs';

import { checkIfValidUUID, breadcrumbTitle } from 'utils/Utils';

const { Title } = Typography;

function PageHeader({ title, extra }) {
  const router = useRouter();
  const { t } = useTranslation();

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/');
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        if (linkPath?.length === 2) {
          if (i === 0) {
            return {
              breadcrumbName: breadcrumbTitle(path),
              path: `/${linkPath.slice(0, i + 2).join('/')}`,
            };
          }
        }

        if (checkIfValidUUID(path)) {
          return {};
        }

        return {
          breadcrumbName: breadcrumbTitle(path),
          path: `/${linkPath.slice(0, i + 1).join('/')}`,
        };
      });

      const removeUUID = pathArray.filter((element) => {
        if (Object.keys(element).length !== 0) {
          return true;
        }

        return false;
      });

      setBreadcrumbs(removeUUID);
    }
  }, [router]);

  return (
    <div className='app-page-header'>
      <Title level={3} className='text-black font-weight-semibold mb-0'>
        {t(title)}
      </Title>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {extra && (
        <div className='d-flex align-items-center text-black'>
          {extra}
        </div>
      )}
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  extra: PropTypes.element,
};

PageHeader.defaultProps = {
  extra: null,
};

export default PageHeader;
