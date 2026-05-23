CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id),
    email VARCHAR(320) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id),
    user_id INT REFERENCES users(id),
    title VARCHAR(512),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id),
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_sessions (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id),
    session_key VARCHAR(255) UNIQUE NOT NULL,
    model_provider VARCHAR(100),
    model_name VARCHAR(100),
    context JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE generated_insights (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id),
    user_id INT REFERENCES users(id),
    insight_type VARCHAR(100),
    payload JSONB,
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE charts (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id),
    title VARCHAR(512),
    chart_type VARCHAR(100),
    config JSONB,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE semantic_models (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id),
    name VARCHAR(255),
    provider VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cached_queries (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id),
    query_hash VARCHAR(128) UNIQUE NOT NULL,
    request_text TEXT,
    result JSONB,
    tool_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tool_executions (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id),
    tool_name VARCHAR(100),
    input JSONB,
    output JSONB,
    status VARCHAR(50),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
