#!/usr/bin/env node

// CLT vs PJ salary calculator for the Brazilian market
// Calculates total annual compensation and equivalence between regimes
// Tax tables: 2025 values (update annually)

// INSS employee progressive table (2025)
const INSS_TABLE = [
  { limit: 1518.00, rate: 0.075 },
  { limit: 2793.88, rate: 0.09 },
  { limit: 4190.83, rate: 0.12 },
  { limit: 8157.41, rate: 0.14 },
];

// IRRF progressive table (2025)
const IRRF_TABLE = [
  { limit: 2259.20, rate: 0.0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 169.44 },
  { limit: 3751.05, rate: 0.15, deduction: 381.44 },
  { limit: 4664.68, rate: 0.225, deduction: 662.77 },
  { limit: Infinity, rate: 0.275, deduction: 896.00 },
];

// Simples Nacional - Anexo V (services, no R factor)
const SIMPLES_ANEXO_V = [
  { limit: 180000, rate: 0.155, deduction: 0 },
  { limit: 360000, rate: 0.18, deduction: 4500 },
  { limit: 720000, rate: 0.195, deduction: 9900 },
  { limit: 1800000, rate: 0.208, deduction: 19080 },
];

// Simples Nacional - Anexo III (services, with R factor >= 28%)
const SIMPLES_ANEXO_III = [
  { limit: 180000, rate: 0.06, deduction: 0 },
  { limit: 360000, rate: 0.112, deduction: 9360 },
  { limit: 720000, rate: 0.135, deduction: 17640 },
  { limit: 1800000, rate: 0.16, deduction: 35640 },
];

// Default monthly benefit values for tech companies in SP
const DEFAULT_BENEFITS = {
  vr: 880,          // R$ 40/day * 22 working days
  va: 600,
  healthPlan: 800,  // employer portion
  dental: 50,
  lifeInsurance: 30,
  gympass: 100,
  plrMonths: 1.5,   // average PLR in months of salary
};

/**
 * Calculate progressive INSS contribution (employee side)
 */
function calculateINSS(grossSalary) {
  let total = 0;
  let previousLimit = 0;

  for (const bracket of INSS_TABLE) {
    if (grossSalary <= previousLimit) break;

    const taxableInBracket = Math.min(grossSalary, bracket.limit) - previousLimit;
    if (taxableInBracket > 0) {
      total += taxableInBracket * bracket.rate;
    }
    previousLimit = bracket.limit;
  }

  return Math.round(total * 100) / 100;
}

/**
 * Calculate IRRF (income tax withheld at source)
 */
function calculateIRRF(grossSalary, inssDeduction) {
  const taxBase = grossSalary - inssDeduction;

  for (const bracket of IRRF_TABLE) {
    if (taxBase <= bracket.limit) {
      const tax = (taxBase * bracket.rate) - bracket.deduction;
      return Math.max(0, Math.round(tax * 100) / 100);
    }
  }

  return 0;
}

/**
 * Calculate Simples Nacional effective tax
 */
function calculateSimples(annualRevenue, useAnexoIII = false) {
  const table = useAnexoIII ? SIMPLES_ANEXO_III : SIMPLES_ANEXO_V;

  for (const bracket of table) {
    if (annualRevenue <= bracket.limit) {
      const effectiveRate = ((annualRevenue * bracket.rate) - bracket.deduction) / annualRevenue;
      return {
        effectiveRate: Math.round(effectiveRate * 10000) / 10000,
        monthlyTax: Math.round(((annualRevenue * bracket.rate) - bracket.deduction) / 12 * 100) / 100,
        annualTax: Math.round((annualRevenue * bracket.rate) - bracket.deduction),
        anexo: useAnexoIII ? 'III' : 'V',
      };
    }
  }

  return { effectiveRate: 0.208, monthlyTax: 0, annualTax: 0, anexo: 'V' };
}

/**
 * Full CLT calculation
 */
function calculateCLT(grossMonthlySalary, benefits = {}) {
  const b = { ...DEFAULT_BENEFITS, ...benefits };

  const inss = calculateINSS(grossMonthlySalary);
  const irrf = calculateIRRF(grossMonthlySalary, inss);
  const netMonthly = grossMonthlySalary - inss - irrf;

  // Annual employer-side components
  const thirteenthSalary = grossMonthlySalary;
  const vacationBonus = grossMonthlySalary * (1 / 3);
  const vacationSalary = grossMonthlySalary;
  const fgtsMonthly = grossMonthlySalary * 0.08;
  const fgtsAnnual = fgtsMonthly * 13.33; // includes 13th and vacation

  // Benefits annual
  const benefitsMonthly = b.vr + b.va + b.healthPlan + b.dental + b.lifeInsurance + b.gympass;
  const benefitsAnnual = benefitsMonthly * 12;

  // PLR
  const plrAnnual = grossMonthlySalary * b.plrMonths;

  // Total compensation
  const totalAnnual = (netMonthly * 12) + thirteenthSalary + vacationSalary + vacationBonus
    + fgtsAnnual + benefitsAnnual + plrAnnual;

  // Employer cost
  const employerINSS = grossMonthlySalary * 0.20;
  const employerRAT = grossMonthlySalary * 0.02;
  const employerSistemaS = grossMonthlySalary * 0.033;
  const employerMonthlyCost = grossMonthlySalary + employerINSS + employerRAT + employerSistemaS
    + fgtsMonthly + benefitsMonthly + (thirteenthSalary / 12) + ((vacationSalary + vacationBonus) / 12);

  return {
    regime: 'CLT',
    grossMonthly: grossMonthlySalary,
    inss,
    irrf,
    netMonthly: Math.round(netMonthly * 100) / 100,
    thirteenthSalary,
    vacationTotal: Math.round(vacationSalary + vacationBonus),
    fgtsAnnual: Math.round(fgtsAnnual),
    benefitsMonthly: Math.round(benefitsMonthly),
    benefitsAnnual: Math.round(benefitsAnnual),
    plrAnnual: Math.round(plrAnnual),
    totalAnnual: Math.round(totalAnnual),
    totalMonthlyEquivalent: Math.round(totalAnnual / 12),
    employerMonthlyCost: Math.round(employerMonthlyCost),
  };
}

/**
 * Full PJ calculation
 */
function calculatePJ(monthlyRevenue, options = {}) {
  const {
    useAnexoIII = false,
    accountantFee = 350,
    healthPlan = 1000,
    vacationReserve = true,
    thirteenthReserve = true,
    emergencyReserve = 750,
    proLabore = Math.min(monthlyRevenue * 0.28, 4000),
  } = options;

  const annualRevenue = monthlyRevenue * 12;

  // Check MEI eligibility
  const meiEligible = annualRevenue <= 81000;

  // Simples Nacional tax
  const simples = calculateSimples(annualRevenue, useAnexoIII);

  // INSS on pro-labore (11% capped)
  const inssProLabore = Math.min(proLabore * 0.11, INSS_TABLE[INSS_TABLE.length - 1].limit * 0.14);

  // Monthly costs
  const monthlyCosts = simples.monthlyTax + accountantFee + inssProLabore + healthPlan + emergencyReserve;

  // Provisions (money set aside for when there is no work)
  const vacationProvision = vacationReserve ? monthlyRevenue / 12 : 0;
  const thirteenthProvision = thirteenthReserve ? monthlyRevenue / 12 : 0;

  const netMonthly = monthlyRevenue - monthlyCosts - vacationProvision - thirteenthProvision;
  const netAnnual = netMonthly * 12;

  return {
    regime: 'PJ',
    monthlyRevenue,
    annualRevenue,
    simplesTax: simples,
    meiEligible,
    accountantFee,
    inssProLabore: Math.round(inssProLabore),
    healthPlan,
    emergencyReserve,
    vacationProvision: Math.round(vacationProvision),
    thirteenthProvision: Math.round(thirteenthProvision),
    totalMonthlyCosts: Math.round(monthlyCosts + vacationProvision + thirteenthProvision),
    netMonthly: Math.round(netMonthly),
    netAnnual: Math.round(netAnnual),
    totalAnnual: Math.round(netAnnual),
    totalMonthlyEquivalent: Math.round(netAnnual / 12),
  };
}

/**
 * Calculate PJ equivalent for a given CLT salary
 */
function cltToPJEquivalent(cltGrossSalary, multiplier = 1.6) {
  return Math.round(cltGrossSalary * multiplier);
}

/**
 * Calculate CLT equivalent for a given PJ revenue
 */
function pjToCLTEquivalent(pjMonthlyRevenue, multiplier = 1.6) {
  return Math.round(pjMonthlyRevenue / multiplier);
}

/**
 * Full comparison between CLT and PJ
 */
function compare(cltGross, pjRevenue, options = {}) {
  const clt = calculateCLT(cltGross, options.benefits);
  const pj = calculatePJ(pjRevenue, options.pj);

  const difference = pj.totalAnnual - clt.totalAnnual;
  const ratio = pjRevenue / cltGross;

  let recommendation;
  if (ratio < 1.4) {
    recommendation = `CLT compensa mais. PJ R$ ${pjRevenue.toLocaleString('pt-BR')} equivale a ${ratio.toFixed(2)}x do CLT, abaixo do mínimo de 1.5x.`;
  } else if (ratio < 1.5) {
    recommendation = `Praticamente equivalente. Considere a estabilidade CLT (FGTS, seguro-desemprego) vs flexibilidade PJ.`;
  } else if (ratio < 1.8) {
    recommendation = `PJ levemente vantajoso financeiramente, mas sem a rede de segurança CLT.`;
  } else {
    recommendation = `PJ significativamente melhor financeiramente. Diferença anual: R$ ${Math.abs(difference).toLocaleString('pt-BR')}.`;
  }

  return { clt, pj, difference, ratio: Math.round(ratio * 100) / 100, recommendation };
}

// CLI interface
const args = process.argv.slice(2);

if (args.includes('--help') || args.length === 0) {
  console.log(`
LucidIA - Calculadora CLT vs PJ

Uso:
  node salary-calc.mjs --clt <salário_bruto>
  node salary-calc.mjs --pj <faturamento_mensal>
  node salary-calc.mjs --compare <clt_bruto> <pj_faturamento>
  node salary-calc.mjs --equivalent <clt_bruto>

Exemplos:
  node salary-calc.mjs --clt 10000
  node salary-calc.mjs --pj 15000
  node salary-calc.mjs --compare 10000 16000
  node salary-calc.mjs --equivalent 10000

Flags:
  --json    Output in JSON format (for agent consumption)
  --help    Show this help message
  `);
  process.exit(0);
}

const jsonOutput = args.includes('--json');

if (args[0] === '--clt') {
  const salary = parseFloat(args[1]);
  const result = calculateCLT(salary);
  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\nCLT - Salário Bruto: R$ ${salary.toLocaleString('pt-BR')}`);
    console.log(`  INSS: -R$ ${result.inss.toLocaleString('pt-BR')}`);
    console.log(`  IRRF: -R$ ${result.irrf.toLocaleString('pt-BR')}`);
    console.log(`  Líquido mensal: R$ ${result.netMonthly.toLocaleString('pt-BR')}`);
    console.log(`  13º salário: R$ ${result.thirteenthSalary.toLocaleString('pt-BR')}/ano`);
    console.log(`  Férias + 1/3: R$ ${result.vacationTotal.toLocaleString('pt-BR')}/ano`);
    console.log(`  FGTS: R$ ${result.fgtsAnnual.toLocaleString('pt-BR')}/ano`);
    console.log(`  Benefícios: R$ ${result.benefitsMonthly.toLocaleString('pt-BR')}/mês`);
    console.log(`  PLR estimada: R$ ${result.plrAnnual.toLocaleString('pt-BR')}/ano`);
    console.log(`  Total anual: R$ ${result.totalAnnual.toLocaleString('pt-BR')}`);
    console.log(`  Equivalente mensal: R$ ${result.totalMonthlyEquivalent.toLocaleString('pt-BR')}/mês`);
  }
}

if (args[0] === '--pj') {
  const revenue = parseFloat(args[1]);
  const result = calculatePJ(revenue);
  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\nPJ - Faturamento: R$ ${revenue.toLocaleString('pt-BR')}/mês`);
    console.log(`  Simples (Anexo ${result.simplesTax.anexo}): -R$ ${result.simplesTax.monthlyTax.toLocaleString('pt-BR')}/mês (${(result.simplesTax.effectiveRate * 100).toFixed(1)}%)`);
    console.log(`  Contador: -R$ ${result.accountantFee}/mês`);
    console.log(`  INSS pró-labore: -R$ ${result.inssProLabore}/mês`);
    console.log(`  Plano de saúde: -R$ ${result.healthPlan}/mês`);
    console.log(`  Reserva emergência: -R$ ${result.emergencyReserve}/mês`);
    console.log(`  Provisão férias: -R$ ${result.vacationProvision}/mês`);
    console.log(`  Provisão 13º: -R$ ${result.thirteenthProvision}/mês`);
    console.log(`  Líquido real: R$ ${result.netMonthly.toLocaleString('pt-BR')}/mês`);
    console.log(`  Total anual: R$ ${result.netAnnual.toLocaleString('pt-BR')}`);
    if (result.meiEligible) console.log(`  Elegível para MEI (limite R$ 81.000/ano)`);
  }
}

if (args[0] === '--compare') {
  const cltGross = parseFloat(args[1]);
  const pjRevenue = parseFloat(args[2]);
  const result = compare(cltGross, pjRevenue);
  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\nComparação CLT R$ ${cltGross.toLocaleString('pt-BR')} vs PJ R$ ${pjRevenue.toLocaleString('pt-BR')}`);
    console.log(`  CLT total anual: R$ ${result.clt.totalAnnual.toLocaleString('pt-BR')}`);
    console.log(`  PJ total anual:  R$ ${result.pj.totalAnnual.toLocaleString('pt-BR')}`);
    console.log(`  Diferença: R$ ${result.difference.toLocaleString('pt-BR')}/ano`);
    console.log(`  Razão PJ/CLT: ${result.ratio}x`);
    console.log(`  ${result.recommendation}`);
  }
}

if (args[0] === '--equivalent') {
  const cltGross = parseFloat(args[1]);
  const factors = [1.4, 1.5, 1.6, 1.7, 1.8];
  if (jsonOutput) {
    console.log(JSON.stringify({ cltGross, equivalents: factors.map(f => ({ factor: f, pj: cltToPJEquivalent(cltGross, f) })) }, null, 2));
  } else {
    console.log(`\nPJ equivalente para CLT R$ ${cltGross.toLocaleString('pt-BR')}`);
    for (const f of factors) {
      const pj = cltToPJEquivalent(cltGross, f);
      const label = f < 1.5 ? '(CLT melhor)' : f < 1.6 ? '(equivalente)' : f < 1.8 ? '(PJ leve vantagem)' : '(PJ clara vantagem)';
      console.log(`  ${f}x = R$ ${pj.toLocaleString('pt-BR')}/mês PJ ${label}`);
    }
  }
}

// Export for use as module
export { calculateCLT, calculatePJ, compare, cltToPJEquivalent, pjToCLTEquivalent };
