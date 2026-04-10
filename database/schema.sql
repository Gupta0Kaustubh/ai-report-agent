CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    industry VARCHAR(255)
);

CREATE TABLE metrics_data (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id),
    metric_name VARCHAR(100),
    metric_value NUMERIC,
    record_date DATE
);

CREATE TABLE generated_reports (
    id SERIAL PRIMARY KEY,
    company_id INT,
    parameters JSONB,
    report TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);