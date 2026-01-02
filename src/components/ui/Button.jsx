import { forwardRef } from 'react';
import './Button.css';

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    type = 'button',
    className = '',
    ...props
}, ref) => {
    const classes = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full',
        loading && 'btn-loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            ref={ref}
            type={type}
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="btn-spinner" />}
            {!loading && icon && iconPosition === 'left' && (
                <span className="btn-icon btn-icon-left">{icon}</span>
            )}
            <span className="btn-text">{children}</span>
            {!loading && icon && iconPosition === 'right' && (
                <span className="btn-icon btn-icon-right">{icon}</span>
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
