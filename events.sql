SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS actualizar_estado_clases
ON SCHEDULE EVERY 1 DAY
STARTS TIMESTAMP(CURRENT_DATE, '23:00:00')
DO
  UPDATE programador
  SET estado = 'Vista'
  WHERE estado = 'Pendiente'
    AND fecha = CURDATE();

CREATE EVENT IF NOT EXISTS generar_cuentas_cobro_mensuales
ON SCHEDULE
  EVERY 1 MONTH
  STARTS TIMESTAMP(DATE_FORMAT(CURRENT_DATE, '%Y-%m-02'), '02:00:00')
DO
  INSERT INTO cuentas_cobro (fecha, valor_hora, horas_trabajadas, numero_documento)
  SELECT
    CURRENT_DATE AS fecha,
    25000 AS valor_hora,
    SUM(TIMESTAMPDIFF(HOUR, p.hora_inicio, p.hora_salida)) AS horas_trabajadas,
    p.numero_documento
  FROM programador p
  WHERE p.estado = 'Vista'
    AND MONTH(p.fecha) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
    AND YEAR(p.fecha) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
    AND NOT EXISTS (
      SELECT 1
      FROM cuentas_cobro c
      WHERE c.numero_documento = p.numero_documento
        AND MONTH(c.fecha) = MONTH(CURRENT_DATE)
        AND YEAR(c.fecha) = YEAR(CURRENT_DATE)
    )
  GROUP BY p.numero_documento;

CREATE EVENT IF NOT EXISTS crear_asistencias_diarias
ON SCHEDULE EVERY 1 DAY
STARTS TIMESTAMP(CURRENT_DATE, '23:15:00')
DO
  INSERT INTO asistencias (fecha, hora_entrada, hora_salida, id_programador, estado)
  SELECT
    p.fecha,
    p.hora_inicio,
    p.hora_salida,
    p.id_programador,
    CASE
      WHEN p.estado = 'Vista' THEN 'cumplida'
      WHEN p.estado = 'Perdida' THEN 'perdida'
    END AS estado
  FROM programador p
  WHERE p.fecha = CURDATE()
    AND p.estado IN ('Vista', 'Perdida')
    AND NOT EXISTS (
      SELECT 1 FROM asistencias a WHERE a.id_programador = p.id_programador
    );


