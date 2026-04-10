from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey, Text, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    industry = Column(String)


class MetricsData(Base):
    __tablename__ = "metrics_data"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    metric_name = Column(String)
    metric_value = Column(Numeric)
    record_date = Column(Date)


class GeneratedReport(Base):
    __tablename__ = "generated_reports"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer)
    parameters = Column(JSON)
    report = Column(Text)