import PropTypes from "prop-types";
import React from "react";

interface IconStar {
    icon: React.ElementType;
}

const IconComponent: React.FC<IconStar> = ({ icon: Icon }) => {
    return <Icon />;
};

IconComponent.propTypes = {
    icon: PropTypes.func.isRequired,
};

export default IconComponent;