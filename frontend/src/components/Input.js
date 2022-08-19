
import { Form } from "react-bootstrap";

export default function Input ({ label, name, onChange, required, type, placeholder, value }) {
    return (
    <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
            type={type}
            onChange={onChange}
            placeholder={placeholder}
            id={name}
            value={value}
            name={name}
            required={required}
        />
    </Form.Group>
    )
}

