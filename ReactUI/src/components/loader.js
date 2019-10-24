import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import {withStyles} from '@material-ui/styles'


const sizes = {
    sm: {
        dimension: 20,
        thickness: 2
    },
    md: {
        dimension: 40,
        thickness: 3.6
    },
    lg: {
        dimension: 60,
        thickness: 4
    }
}

class Loader extends React.Component {

    static propTypes = {
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        variant: PropTypes.oneOf(['linear', 'circular'])
    }

    static defaultProps = {
        size: 'md',
        variant: 'circular',
        secondary: false
    }

    render() {

        const { size, theme, secondary } = this.props
        return (
            <CircularProgress
                style={{ color: secondary ? theme.palette.primary.contrastText : theme.palette.primary.main,
                alignContent: 'center' }}
                size={sizes[size].dimension}
                thickness={sizes[size].thickness} />
        )
    }
}

export default withStyles({}, { withTheme: true })(Loader)