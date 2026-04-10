INSERT INTO companies (id, name, industry)
VALUES 
(1, 'NexusCorp', 'Artificial Intelligence'),
(2, 'Quantum Dynamics', 'Space Tech'),
(3, 'SynthWave AI', 'Robotics'),
(4, 'Zenith Networks', 'Telecom'),
(5, 'Orbital Logistics', 'Supply Chain')
ON CONFLICT DO NOTHING;

INSERT INTO metrics_data (company_id, metric_name, metric_value, record_date)
VALUES
(1, 'revenue', 90000, '2024-01-01'), (1, 'revenue', 98000, '2024-01-15'),
(1, 'revenue', 105000, '2024-02-01'), (1, 'revenue', 110000, '2024-02-15'),
(1, 'revenue', 115000, '2024-03-01'), (1, 'revenue', 125000, '2024-03-15'),
(1, 'revenue', 140000, '2024-04-01'), (1, 'revenue', 165000, '2024-04-15'),
(1, 'revenue', 188000, '2024-05-01'), (1, 'revenue', 205000, '2024-05-15'),
(1, 'revenue', 220000, '2024-06-01'), (1, 'revenue', 235000, '2024-06-15'),
(1, 'revenue', 250000, '2024-07-01'), (1, 'revenue', 260000, '2024-07-15'),

(2, 'active_users', 500, '2024-01-01'), (2, 'active_users', 600, '2024-01-15'),
(2, 'active_users', 750, '2024-02-01'), (2, 'active_users', 890, '2024-02-15'),
(2, 'active_users', 1100, '2024-03-01'), (2, 'active_users', 1250, '2024-03-15'),
(2, 'active_users', 1600, '2024-04-01'), (2, 'active_users', 1800, '2024-04-15'),
(2, 'active_users', 2100, '2024-05-01'), (2, 'active_users', 2300, '2024-05-15'),
(2, 'active_users', 2500, '2024-06-01'), (2, 'active_users', 2800, '2024-06-15'),
(2, 'active_users', 3200, '2024-07-01'), (2, 'active_users', 3500, '2024-07-15'),

(3, 'production_volume', 100, '2024-01-01'), (3, 'production_volume', 110, '2024-01-15'),
(3, 'production_volume', 105, '2024-02-01'), (3, 'production_volume', 120, '2024-02-15'),
(3, 'production_volume', 130, '2024-03-01'), (3, 'production_volume', 135, '2024-03-15'),
(3, 'production_volume', 145, '2024-04-01'), (3, 'production_volume', 160, '2024-04-15'),
(3, 'production_volume', 180, '2024-05-01'), (3, 'production_volume', 170, '2024-05-15'),
(3, 'production_volume', 190, '2024-06-01'), (3, 'production_volume', 210, '2024-06-15'),
(3, 'production_volume', 230, '2024-07-01'), (3, 'production_volume', 245, '2024-07-15'),

(4, 'network_uptime', 99.1, '2024-01-01'), (4, 'network_uptime', 99.2, '2024-01-15'),
(4, 'network_uptime', 98.9, '2024-02-01'), (4, 'network_uptime', 99.5, '2024-02-15'),
(4, 'network_uptime', 99.6, '2024-03-01'), (4, 'network_uptime', 99.8, '2024-03-15'),
(4, 'network_uptime', 99.7, '2024-04-01'), (4, 'network_uptime', 99.9, '2024-04-15'),
(4, 'network_uptime', 99.9, '2024-05-01'), (4, 'network_uptime', 99.9, '2024-05-15'),
(4, 'network_uptime', 99.8, '2024-06-01'), (4, 'network_uptime', 99.9, '2024-06-15'),
(4, 'network_uptime', 99.9, '2024-07-01'), (4, 'network_uptime', 99.9, '2024-07-15'),

(5, 'shipping_tonnage', 5000, '2024-01-01'), (5, 'shipping_tonnage', 5100, '2024-01-15'),
(5, 'shipping_tonnage', 4800, '2024-02-01'), (5, 'shipping_tonnage', 5200, '2024-02-15'),
(5, 'shipping_tonnage', 5300, '2024-03-01'), (5, 'shipping_tonnage', 5500, '2024-03-15'),
(5, 'shipping_tonnage', 5800, '2024-04-01'), (5, 'shipping_tonnage', 6000, '2024-04-15'),
(5, 'shipping_tonnage', 6200, '2024-05-01'), (5, 'shipping_tonnage', 6400, '2024-05-15'),
(5, 'shipping_tonnage', 6300, '2024-06-01'), (5, 'shipping_tonnage', 6600, '2024-06-15'),
(5, 'shipping_tonnage', 6900, '2024-07-01'), (5, 'shipping_tonnage', 7200, '2024-07-15');