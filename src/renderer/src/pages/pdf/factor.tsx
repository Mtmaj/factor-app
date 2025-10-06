import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { Customer, Factor } from '@/types/factors'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { type_docs } from '@/constant/factor'
import jalaaliMoment from '@/utils/date'
import IransansFontBold from '@/assets/fonts/iransans/IRANSansWeb_Bold.ttf'
import IransansFont from '@/assets/fonts/iransans/IRANSansWeb.ttf'
import Logo from '@/assets/images/logo.png'

Font.register({
  family: 'IRANSans',
  fonts: [
    { src: IransansFont, fontStyle: 'normal', fontWeight: 'normal' },
    { src: IransansFontBold, fontStyle: 'normal', fontWeight: 'bold' },
    { src: IransansFontBold, fontStyle: 'italic', fontWeight: 'bold' }
  ]
})

const styles = StyleSheet.create({
  page: { flexDirection: 'column', height: '100%', fontSize: '8px', fontFamily: 'IRANSans' },
  container: {
    width: '90%',
    border: '1px black solid',
    display: 'flex',
    flexDirection: 'column'
  },
  row: { display: 'flex', flexDirection: 'row' },
  cell: { padding: 4, justifyContent: 'center', alignItems: 'center' },
  headerCell: { padding: 4, fontWeight: 'bold', backgroundColor: '#eee' },
  dividerH: { width: '100%', height: 1, backgroundColor: '#000' },
  dividerV: { width: 1, backgroundColor: '#000' },
  summaryRow: {
    display: 'flex',
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#000'
  },
  summaryCell: { width: '20%', padding: 4, alignItems: 'flex-end', justifyContent: 'center' },
  br: { borderRightWidth: 0.5, borderRightColor: '#000' },
  rowRtl: { display: 'flex', flexDirection: 'row-reverse' },
  cellRtl: { padding: 4, justifyContent: 'center', alignItems: 'center', textAlign: 'right' },
  headerCellRtl: { padding: 4, fontWeight: 'bold', backgroundColor: '#eee', textAlign: 'right' },
  sepL: { borderLeftWidth: 1, borderLeftColor: '#000' },
  sepB: { borderBottomWidth: 1, borderBottomColor: '#000' },
  sepT: { borderTopWidth: 1, borderTopColor: '#000' },
  spacerY: { height: 50 },
  spacerRow: { display: 'flex', flexDirection: 'row-reverse' },
  spacerCell: { padding: 0, height: 200, justifyContent: 'center' }
})

export const FactorPDF = ({ factor, customer }: { factor: Factor; customer: Customer }) => {
  const products = factor.products ?? []
  const pricePerGram = Math.ceil(Number(factor.quote) / 4.608)
  const totalWeightWithPlastic = products.reduce(
    (sum, p) => sum + (Number(p.weight_with_plastic) || 0),
    0
  )

  const totalWeight = products.reduce((s, p) => s + Number(p.weight || 0), 0)
  const totalAmount = products.reduce((s, p) => s + Number(p.weight || 0) * pricePerGram, 0)

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            rowGap: 10,
            justifyContent: 'center'
          }}
        >
          <Image
            style={{ width: 120, height: 120, objectFit: 'contain', marginTop: -30 }}
            source={Logo}
          />

          <View style={styles.container}>
            <View
              style={{
                ...styles.row,
                padding: 10,
                justifyContent: 'flex-end',
                borderBottom: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 10,
                  alignItems: 'flex-end'
                }}
              >
                <Text>آدرس: {customer.address ?? 'ندارد'}</Text>
                <Text>
                  حساب بانکی: {customer.card_id ? digitsEnToFa(customer.card_id) : 'ندارد'}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 10,
                  alignItems: 'flex-end'
                }}
              >
                <Text>تلفن: {customer.telephone ? digitsEnToFa(customer.telephone) : 'ندارد'}</Text>
                <Text>
                  موبایل: {customer.phone_number ? digitsEnToFa(customer.phone_number) : 'ندارد'}
                </Text>
              </View>
            </View>

            <View
              style={{
                ...styles.row,
                padding: 10,
                justifyContent: 'flex-end',
                borderBottom: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 10,
                  alignItems: 'flex-end'
                }}
              >
                <Text>شهر: {customer.city ?? 'ندارد'}</Text>
                <Text>نوع سند: {type_docs[factor.type_doc as keyof typeof type_docs]}</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 10,
                  alignItems: 'flex-end'
                }}
              >
                <Text>
                  تاریخ: {digitsEnToFa(jalaaliMoment(factor.date).format('jYYYY/jMM/jDD'))}
                </Text>
                <Text>توسط: {factor.from ?? 'ندارد'}</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 10,
                  alignItems: 'flex-end'
                }}
              >
                <Text>صورت‌حساب: {customer.full_name ?? 'ندارد'}</Text>
                <Text>
                  شماره سند: {factor.document_id ? digitsEnToFa(factor.document_id) : 'ندارد'}
                </Text>
              </View>
            </View>

            <View style={{ borderBottom: '1px solid #000' }}>
              <View style={[styles.rowRtl, { backgroundColor: '#f6f6f6' }, styles.sepB]}>
                <View style={[styles.headerCellRtl, styles.sepL, { width: '8%' }]}>
                  <Text>ردیف</Text>
                </View>
                <View style={[styles.headerCellRtl, styles.sepL, { width: '18%' }]}>
                  <Text>شماره سریال</Text>
                </View>
                <View style={[styles.headerCellRtl, styles.sepL, { width: '26%' }]}>
                  <Text>شرح</Text>
                </View>
                <View style={[styles.headerCellRtl, styles.sepL, { width: '12%' }]}>
                  <Text>وزن (گرم)</Text>
                </View>
                <View style={[styles.headerCellRtl, styles.sepL, { width: '10%' }]}>
                  <Text>عیار</Text>
                </View>
                <View style={[styles.headerCellRtl, styles.sepL, { width: '13%' }]}>
                  <Text>فی</Text>
                </View>
                <View style={[styles.headerCellRtl, { width: '13%' }]}>
                  <Text>فی کل</Text>
                </View>
              </View>

              {products.length === 0 ? (
                <View style={{ ...styles.row }}>
                  <View style={{ ...styles.cell, width: '100%' }}>
                    <Text>محصولی ثبت نشده است</Text>
                  </View>
                </View>
              ) : (
                products.map((p, idx) => {
                  const w = Number(p.weight || 0)
                  const rowTotal = w * pricePerGram
                  return (
                    <View key={idx} style={styles.rowRtl}>
                      <View style={[styles.cellRtl, styles.sepL, { width: '8%' }]}>
                        <Text>{digitsEnToFa(String(idx + 1))}</Text>
                      </View>
                      <View style={[styles.cellRtl, styles.sepL, { width: '18%' }]}>
                        <Text>{p.serial_number || '-'}</Text>
                      </View>
                      <View style={[styles.cellRtl, styles.sepL, { width: '26%' }]}>
                        <Text>نقره ساچمه</Text>
                      </View>
                      <View style={[styles.cellRtl, styles.sepL, { width: '12%' }]}>
                        <Text>{digitsEnToFa(String(w))}</Text>
                      </View>
                      <View style={[styles.cellRtl, styles.sepL, { width: '10%' }]}>
                        <Text>۹۹۵+</Text>
                      </View>
                      <View style={[styles.cellRtl, styles.sepL, { width: '13%' }]}>
                        <Text>{digitsEnToFa(Intl.NumberFormat().format(pricePerGram))}</Text>
                      </View>
                      <View style={[styles.cellRtl, { width: '13%' }]}>
                        <Text>{digitsEnToFa(Intl.NumberFormat().format(rowTotal))}</Text>
                      </View>
                    </View>
                  )
                })
              )}
              {/* اسپیس */}
              <View style={styles.spacerRow}>
                <View style={[styles.spacerCell, styles.sepL, { width: '8%' }]} />
                <View style={[styles.spacerCell, styles.sepL, { width: '18%' }]} />
                <View style={[styles.spacerCell, styles.sepL, { width: '26%' }]} />
                <View style={[styles.spacerCell, styles.sepL, { width: '12%' }]} />
                <View style={[styles.spacerCell, styles.sepL, { width: '10%' }]} />
                <View style={[styles.spacerCell, styles.sepL, { width: '13%' }]} />
                <View style={[styles.spacerCell, { width: '13%' }]} />
              </View>

              <View style={[styles.rowRtl, { backgroundColor: '#f6f6f6' }, styles.sepT]}>
                <View style={[styles.cellRtl, styles.sepL, { width: '52%' }]}>
                  <Text>جمع</Text>
                </View>
                <View style={[styles.cellRtl, styles.sepL, { width: '12%' }]}>
                  <Text>{digitsEnToFa(Intl.NumberFormat().format(totalWeight))}</Text>
                </View>
                <View style={[styles.cellRtl, styles.sepL, { width: '10%' }]}>
                  <Text />
                </View>
                <View style={[styles.cellRtl, styles.sepL, { width: '13%' }]}>
                  <Text>{digitsEnToFa(Intl.NumberFormat().format(pricePerGram))}</Text>
                </View>
                <View style={[styles.cellRtl, { width: '13%' }]}>
                  <Text>{digitsEnToFa(Intl.NumberFormat().format(totalAmount))}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.rowRtl, styles.sepT]}>
              <View style={[styles.summaryCell, styles.sepL]}>
                <Text>
                  مثقال: {digitsEnToFa(Intl.NumberFormat().format(Number(factor.quote)))} تومان
                </Text>
              </View>
              <View style={[styles.summaryCell, styles.sepL]}>
                <Text>گرم: {digitsEnToFa(Intl.NumberFormat().format(pricePerGram))} تومان</Text>
              </View>
              <View style={[styles.summaryCell, styles.sepL]}>
                <Text>جمع مبلغ: {digitsEnToFa(Intl.NumberFormat().format(totalAmount))} تومان</Text>
              </View>
              <View style={[styles.summaryCell, styles.sepL]}>
                <Text>جمع وزن: {digitsEnToFa(Intl.NumberFormat().format(totalWeight))} گرم</Text>
              </View>
              <View style={styles.summaryCell}>
                <Text>
                  جمع سند: {digitsEnToFa(Intl.NumberFormat().format(totalWeightWithPlastic))} گرم
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
