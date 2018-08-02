import * as React from 'react';
import PropTypes from 'prop-types';

import JointList from 'components/JointList';
import styles from './producers.css';

const Producers = ({ list }) => <JointList
    className={styles.producers}
    start="["
    values={list}
    end="]" />;

Producers.propTypes = {
  list: PropTypes.array.isRequired,
};

export default Producers;
