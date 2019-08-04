import React from 'react';

const ShowYaml = (props) => {
    return ( <div>
        <pre>
            {props.yaml ? props.yaml : null}
        </pre>
    </div> );
}

ShowYaml.defaultProps = {
    yaml: false
};
 
export default ShowYaml;