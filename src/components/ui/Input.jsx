import { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Input.css';

const Input = forwardRef(({
    label,
    type = 'text',
    error,
    hint,
    icon,
    className = '',
    fullWidth = true,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={`input-wrapper ${fullWidth ? 'input-full' : ''} ${className}`}>
            {label && (
                <label className="input-label" htmlFor={props.id || props.name}>
                    {label}
                </label>
            )}
            <div className={`input-container ${error ? 'input-error' : ''}`}>
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    ref={ref}
                    type={inputType}
                    className={`input-field ${icon ? 'has-icon' : ''} ${isPassword ? 'has-toggle' : ''}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="input-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                )}
            </div>
            {error && <span className="input-error-text">{error}</span>}
            {hint && !error && <span className="input-hint">{hint}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
