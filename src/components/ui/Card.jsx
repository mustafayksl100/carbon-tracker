import './Card.css';

export default function Card({
    children,
    variant = 'default',
    padding = 'md',
    hover = false,
    glow = false,
    className = '',
    ...props
}) {
    const classes = [
        'card',
        `card-${variant}`,
        `card-padding-${padding}`,
        hover && 'card-hover',
        glow && 'card-glow',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
}

// Card Header component
Card.Header = function CardHeader({ children, className = '', ...props }) {
    return (
        <div className={`card-header ${className}`} {...props}>
            {children}
        </div>
    );
};

// Card Body component
Card.Body = function CardBody({ children, className = '', ...props }) {
    return (
        <div className={`card-body ${className}`} {...props}>
            {children}
        </div>
    );
};

// Card Footer component
Card.Footer = function CardFooter({ children, className = '', ...props }) {
    return (
        <div className={`card-footer ${className}`} {...props}>
            {children}
        </div>
    );
};
